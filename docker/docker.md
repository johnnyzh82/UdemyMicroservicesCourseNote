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


`Docker build .` in the directory with Dockerfile

apk is a package manage build in alpine image

#### Recap on docker build process

- From alpine - Download alpine image
- Run `apk add --update redis`
    - Get image from previous step
    - Create container out of it            -------------> Container!
    - Run `apk add --update redis` in it    -------------> Container! with modified FS
    - Take snapshot of that container's FS  -------------> FS snapshot
    - Shut down that temproray conatiner
    - Get image ready for next intruction
- CMD ["redis-server"]
    - Get image from last step
    - Create a container out of it          -------------> Container!
    - Tell container it should run `redis-server` when started
    - Shut down that temporary container
    - Get image ready for next instruction
- No more steps
- Output is the image generated from previous step


#### Tag an image
- Docker id/repo or project name: version
docker build -t johnnyzh82/redis:latest 

##### Manual generation with docker commit (Don't recommended, use Dockerfile)
- docker run -it alpine sh
- apk add --update redis
- docker commit -c 'CMD ["redis-server"]' <container id>

Finally it outputs the new image id


#### Port forwarding
Run time setup
`docker run -p <incoming request port> : <the port inside the container> <image name>