(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const searchButton = document.querySelector('[data-search-toggle]');
  const searchPanel = document.querySelector('[data-search-panel]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  if (searchButton && searchPanel) {
    searchButton.addEventListener('click', function () {
      searchPanel.classList.toggle('is-open');
      if (searchPanel.classList.contains('is-open') && searchInput) {
        searchInput.focus();
      }
    });
  }

  function renderResults(query) {
    if (!searchResults) {
      return;
    }

    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) {
      searchResults.innerHTML = '';
      return;
    }

    const data = Array.isArray(window.MovieIndex) ? window.MovieIndex : [];
    const matches = data.filter(function (item) {
      const text = item.text.toLowerCase();
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    }).slice(0, 18);

    searchResults.innerHTML = matches.map(function (item) {
      return '<a class="search-result-item" href="./' + item.url + '">' +
        '<strong>' + escapeHtml(item.title) + '</strong>' +
        '<span>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.type) + '</span>' +
        '</a>';
    }).join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      renderResults(searchInput.value);
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (searchInput) {
        renderResults(searchInput.value);
      }
    });
  });

  document.querySelectorAll('[data-page-filter-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
    });
  });

  document.querySelectorAll('[data-page-filter]').forEach(function (input) {
    input.addEventListener('input', function () {
      const words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      document.querySelectorAll('[data-card]').forEach(function (card) {
        const text = (card.getAttribute('data-text') || '').toLowerCase();
        const visible = words.every(function (word) {
          return text.indexOf(word) !== -1;
        });
        card.classList.toggle('is-filtered-out', !visible);
      });
    });
  });

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function run() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        run();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        run();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        run();
      });
    }

    show(0);
    run();
  }
})();
