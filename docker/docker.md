### Basic commands
docker ps --all

docker system prune

docker logs <container id> 
-- get all logs

docker create busybox echo hi there
docker start <container id>

SIGTERM - stop a container give the container some times to stop other processes etc

`docker stop <container id>`

SIGKILL - kill a container   immediately stop the container

`docker kill <container id>`

### Docker execution
docker exec - execute an additional command in a container

`docker exec -it <container id> <commmand>`<br />
-i attach terminal to running process
-t pretty print the output


A better way that avoid rerun docker exec many times. (Open a shell)<br />
`docker exec -it <conatiner id> sh`

sh is command processer/shell in one container


### Docker run
docker run -it busy sh

Start a container with default command


### Create an image


Docker file -> Docker client -> Docker server -> Usable image

#### Creating a docker file
1. Specify a base image
1. Run some commands to install addtional programs
1. Specify a command to run on container start up