import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

// Create a client which is going to connect to nat streaming server and exchange information
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
}); // stan: convention to call a client

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20,
    // });

    // stan.publish('ticket:created', data, () => {
    //     console.log("Event published");
    //     // a call back function after published
    // });

    const publisher = new TicketCreatedPublisher(stan);

    try {
        await publisher.publish({
            id: '123',
            title: 'concert',
            price: 20
        });
    } catch (err) {
        console.error(err);
    }
});