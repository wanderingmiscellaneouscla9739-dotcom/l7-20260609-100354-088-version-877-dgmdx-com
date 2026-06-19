const M3U8_SOURCES = [
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e398cb38b257828eeedbcaa0ae2856da/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/77ae15566dde5cfb920bae4712a38399/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/41cb67b47a3668efaea014219666e659/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/31227358d3c181b7168e28ad248cfb4e/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/d0af4221b8947fda8c23f4955947cb58/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e70b98acb53eb889d108057988609efb/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/86ea18f9954dbaf22eff5e16c41b4a25/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/2df81e778442675885257ce3e84c7173/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/af3d3f3b4940cee04efcd8ff2c9eef0a/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/60b4ddb3d166e1239abfc7adf611a6a3/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/a27121d514ff0079e1e81a6678f14e0c/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/f0d38b8679a1231eff816a8e04cc1a0c/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c66b5309b3b64d15ed856810d6cc0b72/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c99d86ece73a935b77e57d322461ddb5/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fe0c41d994d01211debb24e84e3384a9/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/929fdb8e536c1fc43a83b32d1a838547/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fbc04ae173a0e633458658e80ee78c2a/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/0ba4f146b0e6ea192526706f495d460f/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1e53f0e1aef7ec2fb5f30ef5d309d69c/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1116997bf50b78f22bbfaced8975a021/manifest/video.m3u8"
];

function setHeroSlide(root, index) {
    const slides = Array.from(root.querySelectorAll('.hero-slide'));
    const dots = Array.from(root.querySelectorAll('.hero-dot'));
    if (!slides.length) {
        return;
    }
    const nextIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === nextIndex);
    });
    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === nextIndex);
    });
    root.dataset.activeIndex = String(nextIndex);
}

function initHero() {
    const root = document.querySelector('[data-hero]');
    if (!root) {
        return;
    }
    const dots = Array.from(root.querySelectorAll('.hero-dot'));
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => setHeroSlide(root, index));
    });
    window.setInterval(() => {
        const current = Number(root.dataset.activeIndex || '0');
        setHeroSlide(root, current + 1);
    }, 5200);
}

function cardMatches(card, query, year, region, type) {
    const searchText = (card.dataset.search || '').toLowerCase();
    const cardYear = card.dataset.year || '';
    const cardRegion = card.dataset.region || '';
    const cardType = card.dataset.type || '';
    const queryOk = !query || searchText.includes(query);
    const yearOk = !year || cardYear === year;
    const regionOk = !region || cardRegion === region;
    const typeOk = !type || cardType === type;
    return queryOk && yearOk && regionOk && typeOk;
}

function initFilters() {
    document.querySelectorAll('[data-filter-scope]').forEach((scope) => {
        const input = scope.querySelector('[data-search-input]');
        const yearSelect = scope.querySelector('[data-year-filter]');
        const regionSelect = scope.querySelector('[data-region-filter]');
        const typeSelect = scope.querySelector('[data-type-filter]');
        const cards = Array.from(scope.querySelectorAll('.movie-card'));
        const empty = scope.querySelector('[data-empty-state]');
        const apply = () => {
            const query = input ? input.value.trim().toLowerCase() : '';
            const year = yearSelect ? yearSelect.value : '';
            const region = regionSelect ? regionSelect.value : '';
            const type = typeSelect ? typeSelect.value : '';
            let visible = 0;
            cards.forEach((card) => {
                const ok = cardMatches(card, query, year, region, type);
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        };
        [input, yearSelect, regionSelect, typeSelect].forEach((element) => {
            if (element) {
                element.addEventListener('input', apply);
                element.addEventListener('change', apply);
            }
        });
        apply();
    });
}

function loadHlsLibrary() {
    if (window.Hls) {
        return Promise.resolve(window.Hls);
    }
    return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-hls-loader]');
        if (existing) {
            existing.addEventListener('load', () => resolve(window.Hls));
            existing.addEventListener('error', reject);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
        script.async = true;
        script.dataset.hlsLoader = 'true';
        script.addEventListener('load', () => resolve(window.Hls));
        script.addEventListener('error', reject);
        document.head.appendChild(script);
    });
}

async function attachSource(video, src, status) {
    if (video.dataset.ready === 'true') {
        return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.dataset.ready = 'true';
        return;
    }
    const Hls = await loadHlsLibrary();
    if (Hls && Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        video._hls = hls;
        video.dataset.ready = 'true';
        return;
    }
    if (status) {
        status.textContent = '当前浏览器暂不支持播放';
    }
}

function initPlayers() {
    document.querySelectorAll('.video-shell').forEach((shell) => {
        const video = shell.querySelector('video');
        const button = shell.querySelector('[data-play-button]');
        const status = shell.querySelector('[data-video-status]');
        const muteButton = shell.querySelector('[data-mute-button]');
        const fullButton = shell.querySelector('[data-full-button]');
        if (!video) {
            return;
        }
        const src = video.dataset.src || M3U8_SOURCES[0];
        const play = async () => {
            if (status) {
                status.textContent = '正在加载高清内容';
            }
            try {
                await attachSource(video, src, status);
                await video.play();
                shell.classList.add('is-playing');
                if (status) {
                    status.textContent = '正在播放';
                }
            } catch (error) {
                if (status) {
                    status.textContent = '点击播放按钮继续播放';
                }
            }
        };
        if (button) {
            button.addEventListener('click', play);
        }
        video.addEventListener('click', () => {
            if (video.paused) {
                play();
            } else {
                video.pause();
            }
        });
        video.addEventListener('play', () => shell.classList.add('is-playing'));
        video.addEventListener('pause', () => shell.classList.remove('is-playing'));
        if (muteButton) {
            muteButton.addEventListener('click', () => {
                video.muted = !video.muted;
                muteButton.textContent = video.muted ? '打开声音' : '静音';
            });
        }
        if (fullButton) {
            fullButton.addEventListener('click', () => {
                const target = shell;
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else if (target.requestFullscreen) {
                    target.requestFullscreen();
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initFilters();
    initPlayers();
});
