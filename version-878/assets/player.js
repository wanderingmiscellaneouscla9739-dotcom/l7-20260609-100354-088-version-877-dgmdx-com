(function () {
  const video = document.querySelector('[data-player]');
  const trigger = document.querySelector('[data-player-trigger]');
  const startButtons = document.querySelectorAll('[data-player-start]');

  if (!video) {
    return;
  }

  const stream = video.getAttribute('data-stream');
  let attached = false;

  function attachStream() {
    if (attached || !stream) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      return;
    }

    video.src = stream;
  }

  function playVideo() {
    attachStream();
    if (trigger) {
      trigger.classList.add('is-hidden');
    }
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (trigger) {
    trigger.addEventListener('click', playVideo);
  }

  startButtons.forEach(function (button) {
    button.addEventListener('click', playVideo);
  });

  video.addEventListener('click', function () {
    if (!attached) {
      playVideo();
    }
  });

  video.addEventListener('play', function () {
    if (trigger) {
      trigger.classList.add('is-hidden');
    }
  });
})();
