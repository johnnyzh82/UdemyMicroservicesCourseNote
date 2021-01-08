### How to deploy kubernetes to cloud

Usually we created a config for deployment and service together

To get round of Chrome self-assigned certificate issue.

You can type `thisisunsafe` secret key to pass that screen

Turtorial: https://docs.microsoft.com/en-us/azure/aks/tutorial-kubernetes-prepare-app#:~:text=%20Tutorial%3A%20Prepare%20an%20application%20for%20Azure%20Kubernetes,Compose%20can%20be%20used%20to%20automate...%20More%20

- ACR: Azure container register - a private container registry to store images
- AKS: Azure kubernetes services - management of cluster, pod, deployment and services

##### Create ACR
1. First to create ACR, and login to your ACR 
2. Tag an image
3. Push image to ACR

##### Create AKS
1. Install kubernetes CLI
2. Connect kubernetes using kubectl

Note that skaffold doesn't have azure support for now

##### Test applicatoin
1. Install ingress-nginx
2. Update manifest yaml files
3. Deploy application using kubectl apply
4. Test application by hooking to the ingress load balancer public ip address


### Express response normalization strategies
Use a library call `express-validator` to validate request payload

Check detail implementation under `routes`

#### Typescript interfaces vs abstract class
- Abstract class can not be instantiated
- Abstract class is used to set up requirement for subclasses
- Abstract class does create a Class when translated to JS, which means we can use it in 'instanceof' checks. However interface fades away when translated to JS and it only exists in TS

#### Async middleware route handler
1. Utilize function `next` to throw custom error 
```javascript
app.get("*", async (req, res, next) => {
    next(new NotFoundError());
});
```
2. `express-async-errors` npm package and throw like regular sync fucntion

### Database management and modeling
Mongo db by default listens to port 27017


1. Mongoose user model - represent the entire collection of users
2. Mongoose user document - represent the single user

Two main problems:
1. TS + Mongoose on the types
2. Additional properties added by Mongoose

##### Type checking
User factory pattern to create new object document to enforce object signature by typescript

Better solution is using static build
```javascript
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};
```

Hash the user password in User model

## Authentication strategies 
### Two general strategies to authenticate user request
1. Individual service rely on the auth service (A centralized service for request authentication)
Downside: single point of failure
2. Teach each service to decide whether user is authenticated or not
Downside: duplication & issue with centrual user management (like blacklist or ban an account)


#### Cookie and encryption
When user is considered to be logged in. Send them a JWT token in a cookie.

Make sure content of a cookie is easy to understand between different languages

**Not** encrypt the cookie content because JWT's are tamper resistent

#### Generate JWT token
jsonwebtoken library

#### Securely store secrets with Kubernetes
Share secret in kubernetes between different services

An object 'Secret' (like Deployment, Service)

Secret is exposed as an environment variable and can be accessed by Pods

Imperative approach:
```
kubectl create secret generic jwt-secret --from-literal=jwt=asdf
```
+ **generic** - kind of secret.
+ **jwt-secret** - name of secret.
+ **jwt=asdf** - key vaule pair of the secret.

Declarative approach: to save the secret somewhere else

List secrets:
```
kubectl get secrets
```

yaml file configuration
```yaml
env:
- name: JWT_KEY
    valueFrom:
    secretKeyRef:
        name: jwt-secret
        key: JWT_KEY
```

access env variables in a pod, ususaly put a guard check before application starts
`process.env.JWT_KEY`

formatting json properties
`mongoose.Schema` has a `toJSON` transform function that allows you to delete/update JSON properties, and this logic is usually implemented at view level

Ex:
```javascript
const userSchema = new mongoose.Schema({
    email: {
        type: String, // refer to actual constructor String
        required: true,
    },
    password: {
        type: String, // refer to actual constructor String
        required: true,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

```

### About jwt library
`jsonwebtoken` can be used for generating, signing and verifying JWT tokens

#### Modify exsiting typescript interfaces
```javascript
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}
```
The way to define middleware function is to abstract implementation and inject handler directly in the router.get/post ... functions
```javascript
router.get("...", injectFunction, ...);
```

## Testing
- Test a single piece of code in isolation
    - middlewares
- Test how different pieces of code work together
    - Request flowing through multiple middlewares to a request handler
- Test how different component work together
    - Make request to service, ensure write to database was complete
- Test how different services work together
    - Creating a 'payment' at the 'payments' service should affect the 'orders' service

The dev dependencies used here are
- Jest
- Supertests
- Mongodb memeory server

Steps:
1. Abstract the `index.ts` and add `setup.ts` to have mongo memeory server and test setup
2. Create `signup.test.ts` and use supertest to mock request and response
```javascript
return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: "password"
    })
    .expect(201);
```

## Integrating a Server-Side-Rendered React App
`next js` is a framework to use to implement server side rendering service.

`ingress-srv.yaml` defines a list of path to match incoming request in order. Make sure match first specific request in order.

**#202**: `next.js` sometimes is finicky with file change detection when it's running inside a docker container. The solution is configuring the middleware when project starts with specifying the poll watch options.

```javascript
module.export = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
};
```

**#203** Global CSS. A file is called `_app.js`. When importing your component from `index.js`. Nextjs wraps it up inside of it's own custom default component. 
- Component: component itself
- pageProps: properties passed to component
This thin wrapper will have global css included at top
[Github nextjs Global CSS must be in your custom <App>] (https://github.com/vercel/next.js/blob/master/errors/css-global.md)
**#204** Sign up form
`auth/signup.js`
**#205** Sign up form email/password input handling
useState hook of react
```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
```
**#206** sign up request (client -> engix controller -> cluster ip service -> pod that running container -> create user)
**#207** handling errors -> useState and set errors state and bind to html
**#208, 209** the useRequest Hook
url, method, body -----------> useRequest Hook -----------> doRequest, errors

This is a shared function that abstract the global error handling. Set a global error, setErrors state under `hooks/use-request.js`. In the signup.js we can just call doRequest (actual ajax call function) and errors(mapped html error list).
```javascript
const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
        email, password
    }
});
```
**#210** on success handling
**#211** server side rendering
Request -> Next JS does
1. inspect URL of incoming request. Determine set of components to show
2. Call those component's 'getInitialProps' static method
3. Render each component with data from 'getInitialProps' one time
4. Assemble HTML from all components, send back response 

What is `getInitialProps`? Fetch some data during server render process.

**#212, #213, #214** Fetching Data during Server side rendering
Fetching currentuser under server side rendering process causing some connection refuse error because the node can not evalute the domain and fetch to localhost of kubernetes environment.

**#215** Cross namespace service communication
`kubectl get namespace` get all kubectl namespaces
`kubectl get services -n ingress-nginx` get services under a different namespace, without -n it will only return default namespace

default <----> ingress-nginx
http://ingress-nginx.ingress-nginx.svc.cluster.local
{NAMEOFSERVICE}.{NAMESPACE}.srv.cluster.local

#### External name service - remaps the domain of request

**#216** The time getInitialProps get called.
- on the server
    - hard refresh of the page
    - clicking link from different domain
    - typing URL into address bar
- on the client'
    - navigating from one page to anther while in the app (NextJS router)

**#219, #220** Specifying the Host
Need to explicitly tell nginx which domain request was sent to
```javascript
 const { data } = await axios.get(
    'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
        headers: {
            Host: 'ticketing.dev'
        }
    }
);
```

Cookie is not forwarded to auth service through ingress nginx
Solution is replace header with req.header in getInitialProps function

**#221, #222**, build a reusable API client that handles server/client call separately to improve readability

**#223** Create a sign in page

**#224, #225** Reusable header / Refactor

**#226, 227** How to handle multiple GetInitialProps? Pass appContext context through
```javascript
let pageProps = {};
if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
}
```


## Section 12: code sharing and reuse between services

Publish common code to NPM registry and install the dependency in other services

NPM Public registry (Organization)