(function () {
  var nav = document.querySelector('[data-site-nav]');
  var toggle = document.querySelector('[data-menu-toggle]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 6200);
    }
  }

  var filterAreas = Array.prototype.slice.call(document.querySelectorAll('[data-filter-area]'));

  filterAreas.forEach(function (area) {
    var input = area.querySelector('[data-filter-input]');
    var yearSelect = area.querySelector('[data-year-select]');
    var typeSelect = area.querySelector('[data-type-select]');
    var cards = Array.prototype.slice.call(area.querySelectorAll('[data-card]'));
    var empty = area.querySelector('[data-empty-state]');

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function filterCards() {
      var query = normalize(input ? input.value : '');
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }

        if (year && cardYear !== year) {
          matched = false;
        }

        if (type && cardType !== type) {
          matched = false;
        }

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
      input.addEventListener('input', filterCards);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', filterCards);
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', filterCards);
    }

    var params = new URLSearchParams(window.location.search);
    var queryParam = params.get('q');
    if (queryParam && input) {
      input.value = queryParam;
    }

    filterCards();
  });
})();