#!/bin/bash

# build the flask container
docker build -t thelusina/cibuscart .

# create the network
docker network create cibuscart

# start the ES container
docker run -d --net cibuscart -p 9200:9200 -p 9300:9300 --name es elasticsearch

# start the flask app container
docker run -d --net cibuscart -p 5000:5000 --name cibuscart-server thelusina/cibuscart

docker run -d --net cibuscart -p 3000:3000 --name cibuscart-client thelusina/cibuscart
