(function () {
  window.MovieStreamPlayer = function (video, button, cover, sourceUrl) {
    if (!video || !button || !sourceUrl) {
      return;
    }

    var prepared = false;
    var hlsInstance = null;

    function prepare() {
      if (prepared) {
        return;
      }

      prepared = true;
      video.setAttribute('playsinline', 'playsinline');
      video.setAttribute('webkit-playsinline', 'webkit-playsinline');
      video.controls = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = sourceUrl;
    }

    function begin() {
      prepare();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    button.addEventListener('click', begin);

    if (cover) {
      cover.addEventListener('click', begin);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        begin();
      } else {
        video.pause();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  };
})();