# NATS Streaming Server (docs.nats.io)

- NATS
- (*) NATS Streaming Server: build on top of NATS

##### 207 creating a NAT streaming deployment
Create a file call `nats-depl.yaml` to include nats deployment and service
The service exposes two separate ports: 4222 and 8222

also `args` specifies a list of argument running when nat streaming server image started
```yaml
containers:
    - name: nats
    image: nats-streaming:0.17.0
    args: [
        '-p',
        '4222',
        '-m',
        '8222',
        '-hbi',
        '5s',
        '-hbt',
        '5s',
        '-hbf',
        '2',
        '-SD',
        '-cid',
        'ticketing'
    ]

...

- name: client
    protocol: TCP
    port: 4222
    targetPort: 4222
- name: monitoring
    protocol: TCP
    port: 8222
    targetPort: 8222
```


##### 271 Big notes on NATS Steaming

The custom build event bus service is basically a node express application listens on the request and using `axios` to send another request to other services.


The NAT Streaming is a client library called `node-nats-streaming` to communicate with NATS
https://www.npmjs.com/package/node-nats-streaming

NAT streaming requires us to subscribe to `channels`. Events are emitted to specific channels

- `publisher.ts` publishing events
- `listener.ts` listening events

How to connect to NATS pod in kubernetes Node?
Port-forward port 4222 to Nats pod

- `kubectl get pods`
- `kubectl port-forward nats-depl-55dbd7d876-nfjkd 4222:4222`


Publishing events

(data, ticket:created) --> stan client --> NAT Streaming channels --> Listener: stan client / subscription (listen for information)

Listening events

- Subscription
- Message

Tip: type `rs` to restart nats publisher/listener channel

##### 278 Client ID generation

**How to scale service? Horizontally or vertically**
Horizontally created multiple service instances

`npm run listen` firstly gets an error: [ERROR] 23:48:56 Error: Unhandled error. ('stan: clientID already registered')
abc here is the client id.
```javascript
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
}); 
```
**Local solution**: randomly generate client id, but we don't want to allow incoming event go to every copy of service. Build-in NAT streaming has something call `Queue Groups`, we can have mulitple queue groups associated with one channel.

Every instance of service join the queue group, so the incoming event will only be send to one instance.

```javascript
const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group');
```

The subscription option is specified via a list of function chaining instead of passing object

`setManualAckMode` mode is used when ack must be processed

Monitoring:
Port forward to another port 8222 for monitoring
`kubectl port-forward nats-depl-55dbd7d876-nfjkd 4222:4222`

Then access local NATS monitoring url
http://localhost:8222/streaming
- client: all clients connected to NATS server
```json
  "clients": [
    {
      "id": "23e50f86",
      "hb_inbox": "_INBOX.ANSM1HLO28DGWXG0RPIN2O"
    },
    {
      "id": "aaddb21a",
      "hb_inbox": "_INBOX.06XR90MZI93ML9A1M7UAGH"
    },
    {
      "id": "abc",
      "hb_inbox": "_INBOX.SQU62IZMG9WSVDU1A8BW8C"
    }
  ]
```
- channel: all active channels
http://localhost:8222/streaming/channelsz?subs=1
```json
"channels": [
    {
      "name": "ticket:created",
      "msgs": 17,
      "bytes": 1207,
      "first_seq": 1,
      "last_seq": 17,
      "subscriptions": [
        {
          "client_id": "23e50f86",
          "inbox": "_INBOX.ANSM1HLO28DGWXG0RPINME",
          "ack_inbox": "_INBOX.j8X6eTULVgCJnGqsbJMxge",
          "queue_name": "orders-service-queue-group",
          "is_durable": false,
          "is_offline": false,
          "max_inflight": 16384,
          "ack_wait": 30,
          "last_sent": 17,
          "pending_count": 0,
          "is_stalled": false
        },
        {
          "client_id": "aaddb21a",
          "inbox": "_INBOX.06XR90MZI93ML9A1M7UBDE",
          "ack_inbox": "_INBOX.j8X6eTULVgCJnGqsbJMxll",
          "queue_name": "orders-service-queue-group",
          "is_durable": false,
          "is_offline": false,
          "max_inflight": 16384,
          "ack_wait": 30,
          "last_sent": 0,
          "pending_count": 0,
          "is_stalled": false
        }
      ]
    }
  ]
```

There is a delay of the incoming request of when listener restarted. The reason is NATS Sever will wait for the client to be back and wait 30 seconds. If the client didn't respond in 30 seconds, then the listener subscriptions remove the client.

One solution to tell NATS not to wait is using hbi, hbt, hbf (heart beat)(frequency, time (how long), number of failures)

## Common questions
Concurrency issue solutions (not working)
- **Using a shared state between services of last event processed**: add extra layer of dependency between requests, and one delayed event can hold other event
- **Last event processed traced by resource ID**: NAT Streaming might need dedicated channels to each resource and cause overhead to NATS streaming server
- ****

## Solution:
Transaction service: store each event to transactions database


#### Redelivering event & durable subscriptions
`setDeliverAllAvailable` make sure very first time subscription is created, keep a list of previous events
`setDurableName` create a durable subscription that can hold temporary events when target services went down, also track whether events are processed or not. Make sure service never missed any events


## Section 15 Connecdting to NATS in a NODE JS world
291. Reusable NATS listener

Class listener:
| Property  | Type | Goal |
| ------------- | ------------- | ------------- |
| (abstract) subject  | string  | Name of the channel this listener is going to listen to |
| (abstract) onMessage  | (event: EventData) => void | Function to run when a message is received |
| client | Stan | Pre-initialized NATS client |
| queueGroupName | string | Name of the queue group this listener will join |
| ackWait | number | Number of seconds this listener has to ack a message |
| subscriptionOption | SubscriptionOption | Default subscription option |
| listen | () => void | Code to set up the subscription |
| parseMessage | (msg: Message) => any | Helper function to parse a message |

Can extend to class listener to other type of custom class listener with subject/queuegroup names...


295. Leveraging Typescript for Listener Validation
strong mapping between subject names and event data
`ticket:created` -> id, title, price
`order:updated` -> id, userId, ticketId

298. Enforcing listener subjects
Using typescript generic way to tell each subclass type validation
`export abstract class Listener<T extends Event>{`

`subject: Subjects.TicketCreated = Subjects.TicketCreated;` is to make sure that the type subject is not immutable which is equal to the `final` keyword in java.

Similarly the publisher can be abstracted into a base class

**Key in mind that using typescript, we should leverage these typsecript sugers**
- Generics class type <T extends something...>
- Abstract class, function
- always typed


304. Awaiting Event publication