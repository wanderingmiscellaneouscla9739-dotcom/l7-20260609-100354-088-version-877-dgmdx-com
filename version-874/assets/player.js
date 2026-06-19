(function () {
    function attachPlayer(shell) {
        var source = shell.getAttribute('data-src');
        var video = shell.querySelector('video');
        var button = shell.querySelector('.play-overlay');
        var loaded = false;
        var hls = null;

        if (!source || !video) {
            return;
        }

        function loadSource() {
            if (loaded) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }

            loaded = true;
            video.controls = true;
            shell.classList.add('is-ready');
        }

        function start() {
            loadSource();
            var playPromise = video.play();

            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.then(function () {
                    shell.classList.add('is-playing');
                }).catch(function () {
                    shell.classList.add('is-ready');
                });
            } else {
                shell.classList.add('is-playing');
            }
        }

        shell.addEventListener('click', function (event) {
            if (event.target === video && loaded) {
                return;
            }
            start();
        });

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                start();
            });
        }

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(attachPlayer);
})();
