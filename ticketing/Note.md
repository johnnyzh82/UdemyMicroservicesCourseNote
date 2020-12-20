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
```
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
```
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