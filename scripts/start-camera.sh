#!/bin/bash

# https://www.lifewire.com/pass-arguments-to-bash-script-2200571

SERVER_IP_ADDRESS="192.168.1.71"

killProcesses() {
  killall picam --wait;
  killall ffmpeg --wait;
}
startFFmpegLocal() {
  ffmpeg -i tcp://127.0.0.1:8181?listen \
  -c:v copy -c:a aac -ar 44100 -ab 40000 \
  -f flv rtmp://127.0.0.1:4000/live/monitor &
  sleep 2
}
startFFmpegCloud() {
  ffmpeg -i tcp://127.0.0.1:8181?listen \
  -c:v copy -c:a aac -ar 44100 -ab 40000 \
  -f flv "rtmp://$SERVER_IP_ADDRESS/live/monitor" &
  sleep 2
}
startFFmpegLocalAndCloud() {
  ffmpeg -i tcp://127.0.0.1:8181?listen \
  -c:v copy -c:a aac -ar 44100 -ab 40000 \
  -f flv rtmp://127.0.0.1:4000/live/monitor \
  -c:v copy -c:a aac -ar 44100 -ab 40000 \
  -f flv "rtmp://$SERVER_IP_ADDRESS/live/monitor" &
  sleep 2
}
startPiCam() {
  ~/picam/picam --alsadev hw:1,0 --tcpout tcp://127.0.0.1:8181 &
}

local=false
cloud=false

while getopts lc option
do
case "${option}"
in
l) local=true;;
c) cloud=true;;
esac
done

killProcesses

if ($local && $cloud); then
  echo "start streaming locally & to the cloud"
  startFFmpegLocalAndCloud
  startPiCam
elif ($local); then
  echo "start streaming locally only"
  startFFmpegLocal
  startPiCam
elif ($cloud); then
  echo "start streaming to cloud only"
  startFFmpegCloud
  startPiCam
else
  echo "No Streaming"
fi


