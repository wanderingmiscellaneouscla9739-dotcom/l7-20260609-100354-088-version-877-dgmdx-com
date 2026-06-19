(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function attach(box) {
        var video = box.querySelector("video");
        var button = box.querySelector(".play-mask");
        var url = box.getAttribute("data-stream");
        var hlsInstance = null;

        if (!video || !url) {
            return;
        }

        function bindMedia() {
            if (video.getAttribute("data-bound") === "1") {
                return;
            }
            video.setAttribute("data-bound", "1");
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
                return;
            }
            video.src = url;
        }

        function play() {
            bindMedia();
            box.classList.add("is-playing");
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    box.classList.remove("is-playing");
                });
            }
        }

        if (button) {
            button.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            box.classList.add("is-playing");
        });
        window.addEventListener("beforeunload", function () {
            if (hlsInstance && typeof hlsInstance.destroy === "function") {
                hlsInstance.destroy();
            }
        });
    }

    ready(function () {
        Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(attach);
    });
})();
