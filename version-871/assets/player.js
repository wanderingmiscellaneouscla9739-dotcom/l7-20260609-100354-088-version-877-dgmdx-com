(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function attachStream(video, mediaUrl) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = mediaUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(mediaUrl);
      hls.attachMedia(video);
      return;
    }

    video.src = mediaUrl;
  }

  function startPlayer(video, cover, mediaUrl, state) {
    if (!video || !mediaUrl) {
      return;
    }

    if (!state.loaded) {
      attachStream(video, mediaUrl);
      state.loaded = true;
    }

    video.controls = true;

    if (cover) {
      cover.classList.add("is-hidden");
    }

    var playTask = video.play();

    if (playTask && typeof playTask.catch === "function") {
      playTask.catch(function () {
        video.controls = true;
      });
    }
  }

  ready(function () {
    var mediaUrl = window.__mediaUrl;
    var video = document.querySelector("[data-player-video]");
    var cover = document.querySelector("[data-player-cover]");
    var state = { loaded: false };

    if (!video || !mediaUrl) {
      return;
    }

    if (cover) {
      cover.addEventListener("click", function () {
        startPlayer(video, cover, mediaUrl, state);
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayer(video, cover, mediaUrl, state);
      }
    });
  });
})();
