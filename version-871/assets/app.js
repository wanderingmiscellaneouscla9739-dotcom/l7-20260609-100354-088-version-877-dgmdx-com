(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function getRoot() {
    return document.body.getAttribute("data-root") || "./";
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
        document.body.classList.toggle("menu-open", panel.classList.contains("is-open"));
      });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";
        var target = getRoot() + "search.html";
        if (query) {
          target += "?q=" + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var activeIndex = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === activeIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot") || 0));
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }

    var searchInput = document.querySelector("[data-local-search]");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-button]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var currentFilter = "all";

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : "");
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var category = normalize(card.getAttribute("data-category"));
        var matchesSearch = !query || text.indexOf(query) !== -1;
        var matchesFilter = currentFilter === "all" || category === currentFilter || text.indexOf(currentFilter) !== -1;
        card.classList.toggle("is-hidden", !(matchesSearch && matchesFilter));
      });
    }

    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var queryParam = params.get("q");
      if (queryParam) {
        searchInput.value = queryParam;
      }
      searchInput.addEventListener("input", applyFilters);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        filterButtons.forEach(function (item) {
          item.classList.remove("is-active");
        });
        button.classList.add("is-active");
        currentFilter = normalize(button.getAttribute("data-filter"));
        applyFilters();
      });
    });

    applyFilters();
  });
})();
