function setupLiveStream() {
  if (flvjs.isSupported()) {
    const videoElement = document.querySelector('#liveStream');
    const flvPlayer = flvjs.createPlayer({
        type: 'flv',
        isLive: true,
        hasVideo: true,
        hasVideo: true,
        url: 'ws://192.168.1.71:8000/live/monitor.flv'
    });
    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();
    flvPlayer.play();
    return flvPlayer;
  } else {
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const flvPlayer = setupLiveStream()
  if (!flvPlayer) {
    console.log("💩 flvjs is not supported");
  }
});


