(function () {
  var body = document.body;
  var header = document.querySelector(".site-header");
  var menuButton = document.querySelector(".menu-toggle");

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      body.classList.toggle("mobile-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var index = 0;
    var timer = null;

    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle("active", position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle("active", position === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    }

    var previous = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");

    if (previous) {
      previous.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-go-slide")) || 0);
        restart();
      });
    });

    start();
  }

  function normalized(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ");
  }

  function setupFilter() {
    var grids = Array.prototype.slice.call(document.querySelectorAll(".filterable-grid"));
    grids.forEach(function (grid) {
      var section = grid.closest("section") || document;
      var input = section.querySelector(".card-filter-input");
      var select = section.querySelector(".card-filter-select");
      var empty = section.querySelector(".empty-state");
      var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-search]"));

      function applyFilter() {
        var query = normalized(input ? input.value : "");
        var type = normalized(select ? select.value : "");
        var visible = 0;

        cards.forEach(function (card) {
          var data = normalized(card.getAttribute("data-search"));
          var matched = (!query || data.indexOf(query) !== -1) && (!type || data.indexOf(type) !== -1);
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }
      if (select) {
        select.addEventListener("change", applyFilter);
      }
      applyFilter();
    });
  }

  function setupSearchPage() {
    if (!document.body.classList.contains("search-page")) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    var heroInput = document.querySelector(".hero-search input[name='q']");
    var filterInput = document.querySelector(".card-filter-input");
    var headerInputs = Array.prototype.slice.call(document.querySelectorAll(".top-search input[name='q'], .mobile-search input[name='q']"));

    if (heroInput) {
      heroInput.value = query;
    }
    if (filterInput) {
      filterInput.value = query;
      filterInput.dispatchEvent(new Event("input"));
    }
    headerInputs.forEach(function (input) {
      input.value = query;
    });
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll(".player-shell"));
    players.forEach(function (shell) {
      var video = shell.querySelector("video");
      var cover = shell.querySelector(".player-cover");
      var stream = shell.getAttribute("data-stream");
      var hls = null;
      var ready = false;

      function bindStream() {
        if (ready || !video || !stream) {
          return;
        }
        ready = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
          return;
        }

        video.src = stream;
      }

      function startPlayback() {
        bindStream();
        shell.classList.add("is-playing");
        video.controls = true;
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function () {
            shell.classList.remove("is-playing");
          });
        }
      }

      if (cover) {
        cover.addEventListener("click", startPlayback);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            startPlayback();
          }
        });
        video.addEventListener("play", function () {
          shell.classList.add("is-playing");
        });
        window.addEventListener("beforeunload", function () {
          if (hls) {
            hls.destroy();
          }
        });
      }
    });
  }

  setupHero();
  setupFilter();
  setupSearchPage();
  setupPlayers();
})();
