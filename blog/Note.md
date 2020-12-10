This repo is the notes and course code for the Udemy course <b>Microservices with NodeJS and React</b>

https://www.udemy.com/course/microservices-with-node-js-and-react/

**Keyword**: Self-contained<br />
**Challege**: Data management between services

#### Why: Database-Per-Servoce
1. Independency
2. Schema/structure change without impacting other services
3. Flexibility (SQL vs NoSql)

#### Problem:
How to join the tables among different services databases? Show order made by a user (order, product and users)

#### Solution:
Communicate between services

Sync/Async  (Not javascript definition)

**Sync**: direct request<br />
**Async**: events (Event bus)

**Event bus** is the central service to accept or emit the event from or to other services.


Event bus can save history of events which can be used to restore when some services are down
Event bus is central place to transmit all events to other services


### Docker
<pre>
docker build ./<br />
docker build -t johnnyzh82/posts<br />
docker run [image id or image tag]<br />
docker run -it [image id or image tag] [cmd]<br />
docker ps<br />
docker exec -it [container id] [cmd]<br />
docker logs [container id]<br />
</pre>

### Kubernetes
1. Kubernetes Cluster - a collection of nodes + a master to manage them
2. Node - A VM that will run the containers
3. Pod - More or less a running container (A pod can run multiple containers)
4. Deployment - Monitor a set of pods (make sure they're running and restarts them if they crash)
5. Service - Provide an easy-to-remember URL to access a running container

Kubernetes is used for running a bunch of containers. Docker command is no longer used if we use kubernetes

<pre>
kubectl get pods<br />
kubectl exe it [pod_name] [cmd]<br />
kubectl logs [pod_name]<br />
kubectl delete pod [pod_name]<br />
kubectl apply -f [config file name]<br />
kubectl describe pod [pod_name]<br />
</pre>

#### Kubernetes deployments commands

<pre>
kubectl get deployments<br />
kubectl describe deployments [depl_name]<br />
kubectl apply -f [config file name]<br />
kubectl delete deployments [depl_name]<br />
</pre>

#### A preferred method for update Kubernetes deployments
1. The deployment must be using 'latest' tag in the pod spec
2. Update the code
3. Build the image<br /> 
`docker build -t johnnyzh82/posts .`
4. Push the image to docker hub <br />
`docker push johnnyzh82/posts`
5. Run the command<br />
`kubectl rollout restart deployment posts-depl` and you check check log of pods for new update

#### Kubernetes services
Networking - requests communication between our services (event-bus, posts, comments and etc)

Type of services:
- **Cluster IP**: set an easy-to-remember URL to access a pod. Exposes Pod in the cluster
- **Load Balancer**: make pod accessible from outside the cluster
- **Node Port**: Make a pod accessible from outside the cluster (usually used for dev purposes)


### Load Balancer and Ingerss/Ingress controller
- **Load Balancer Service**: Tells kubernetes to reach out to its provider and provision a load balancer. Gets traffic in to a singler pod.
- **Ingress**: A pod with a set of routing rules to distribute traffic to other services.

_ingress-nginx: https://kubernetes.github.io/ingress-nginx/deploy/_ 

Note the services that occupies port 80:<br />
- Windows Remote Management (WS-Management)<br />
- SSDP Discovery<br />
- Print Spooler<br />
- BranchCache<br />

Ingress controller doesn't know the http request METHOD (get, post, etc). Each request must be unique.

### Skaffold - a tool to automate many tasks in Kubernetes dev environments (Development)
Make it easy to update code in a running pod and create/delete all objects tied to a project at once.

## Key takeaway
1. data is the big challenge in microservices
2. Different ways to share data between services. Mainly focus on async communication
3. Async communication focuses on communicating changes using events sent to an event bus
4. Each service to be 100% self-sufficient. Easy to handle downtime or new service creation
5. Docker makes it easier to package up services
6. Kubernetes makes it easy to deploy + scale services