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