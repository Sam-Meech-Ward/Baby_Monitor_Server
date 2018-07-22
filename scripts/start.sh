#!/bin/bash

ffmpeg -i tcp://127.0.0.1:8181?listen -c:v copy -c:a aac -ar 44100 -ab 40000 -f flv rtmp://127.0.0.1:4000/live/monitor &
sleep 2
~/picam/picam --alsadev hw:1,0 --tcpout tcp://127.0.0.1:8181 &
node app.js