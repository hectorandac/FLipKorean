
function getNetflixPlayer() {
    const videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const playerSessionId = videoPlayer.getAllPlayerSessionIds()[0];
    return videoPlayer.getVideoPlayerBySessionId(playerSessionId);
  }
  
  function rewind() {
    const player = getNetflixPlayer();
    const currentTime = player.getCurrentTime();
    player.seek(Math.max(0, currentTime - 10000));
  }
  
  function forward() {
    const player = getNetflixPlayer();
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    player.seek(Math.min(duration, currentTime + 10000));
  }
  
  function seekTo(time) {
    const player = getNetflixPlayer();
    const duration = player.getDuration();
    player.seek(Math.min(duration, Math.max(0, time * 1000)));
  }

  function togglePlayPause() {
    const player = getNetflixPlayer();
    if (player.isPlaying()) {
      player.pause();
    } else {
      player.play();
    }
  }
  
  window.addEventListener('message', (event) => {
    const { action, time } = event.data;
  
    if (action === 'togglePlayPause') {
        togglePlayPause();
    } else if (action === 'rewind') {
      rewind();
    } else if (action === 'forward') {
      forward();
    } else if (action === 'seekTo') {
      seekTo(time);
    }
  }, false);
  
  