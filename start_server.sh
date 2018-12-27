#!/bin/bash
WORK_DIR="/home/shadowvzs/projects/TwitterTweets"
DOCKER_NETWORK="mynetwork"
EXT_NODE_DIR="${WORK_DIR}/backend/"
INT_NODE_DIR="/home/project"
NODE_CONTAINER_NAME="nodejs"
NODE_IMAGE="nodejs:1"
NODE_PORT="8000"
NODE_ENTRY_POINT="/home/shadowvzs/start.sh"
START_FILE_EX="${WORK_DIR}/node.sh"
START_FILE_IN="/home/shadowvzs/node.sh"


sudo docker run -v ${EXT_NODE_DIR}:${INT_NODE_DIR} -v ${START_FILE_EX}:${START_FILE_IN} -it --rm -p ${NODE_PORT}:${NODE_PORT} --network ${DOCKER_NETWORK}  --privileged --name ${NODE_CONTAINER_NAME} ${NODE_IMAGE} ${NODE_ENTRY_POINT}
