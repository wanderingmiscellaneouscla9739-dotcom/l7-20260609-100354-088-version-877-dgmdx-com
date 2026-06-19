(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function toggleNavigation() {
        var button = document.querySelector("[data-menu-toggle]");
        if (!button) {
            return;
        }
        button.addEventListener("click", function () {
            document.body.classList.toggle("nav-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function restart(index) {
            if (timer) {
                window.clearInterval(timer);
            }
            show(index);
            start();
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                restart(dotIndex);
            });
        });
        show(0);
        start();
    }

    function setupCardFilters() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-card-filter]"));
        forms.forEach(function (form) {
            var targetSelector = form.getAttribute("data-card-filter");
            var target = document.querySelector(targetSelector);
            if (!target) {
                return;
            }
            var cards = Array.prototype.slice.call(target.querySelectorAll(".movie-card, .rank-item"));
            var textInput = form.querySelector("[data-filter-text]");
            var yearSelect = form.querySelector("[data-filter-year]");
            var typeSelect = form.querySelector("[data-filter-type]");

            function applyFilter() {
                var keyword = textInput ? textInput.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";
                var type = typeSelect ? typeSelect.value : "";
                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-title") + " " + card.getAttribute("data-meta")).toLowerCase();
                    var cardYear = card.getAttribute("data-year") || "";
                    var cardType = card.getAttribute("data-type") || "";
                    var matched = true;
                    if (keyword && text.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (year && cardYear !== year) {
                        matched = false;
                    }
                    if (type && cardType.indexOf(type) === -1) {
                        matched = false;
                    }
                    card.classList.toggle("hidden-card", !matched);
                });
            }

            form.addEventListener("input", applyFilter);
            form.addEventListener("change", applyFilter);
        });
    }

    function getQuery(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || "";
    }

    function setupSearchPage() {
        var container = document.querySelector("[data-search-results]");
        var input = document.querySelector("[data-search-input]");
        if (!container || !input || !window.siteSearchItems) {
            return;
        }
        var initial = getQuery("q");
        input.value = initial;

        function createCard(item) {
            var article = document.createElement("article");
            article.className = "movie-card";
            article.setAttribute("data-title", item.title);
            article.setAttribute("data-meta", item.region + " " + item.genre + " " + item.oneLine);
            article.setAttribute("data-year", item.year);
            article.setAttribute("data-type", item.type);
            article.innerHTML = "" +
                "<a href=\"" + item.link + "\" class=\"poster-link\">" +
                "<div class=\"poster-wrap\">" +
                "<span class=\"poster-label\">" + item.year + "</span>" +
                "<img src=\"" + item.image + "\" alt=\"" + item.title + "\" loading=\"lazy\">" +
                "</div>" +
                "<div class=\"card-body\">" +
                "<div class=\"card-meta\"><span class=\"pill\">" + item.region + "</span><span class=\"pill\">" + item.type + "</span></div>" +
                "<h3>" + item.title + "</h3>" +
                "<p>" + item.oneLine + "</p>" +
                "</div>" +
                "</a>";
            return article;
        }

        function render() {
            var keyword = input.value.trim().toLowerCase();
            var items = window.siteSearchItems.filter(function (item) {
                var text = (item.title + " " + item.region + " " + item.type + " " + item.genre + " " + item.oneLine).toLowerCase();
                return !keyword || text.indexOf(keyword) !== -1;
            }).slice(0, 120);
            container.innerHTML = "";
            if (!items.length) {
                var empty = document.createElement("div");
                empty.className = "empty-state";
                empty.textContent = "没有找到匹配的影片，可以换一个关键词继续搜索。";
                container.appendChild(empty);
                return;
            }
            items.forEach(function (item) {
                container.appendChild(createCard(item));
            });
        }

        input.addEventListener("input", render);
        render();
    }

    ready(function () {
        toggleNavigation();
        setupHero();
        setupCardFilters();
        setupSearchPage();
    });
})();
