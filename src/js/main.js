(function () {
    const container = document.querySelector('.page-shell');
    const mobileRoot = document.querySelector('[data-nav-mobile]');
    const sidebarRoot = document.querySelector('[data-nav-sidebar]');

    if (!container || !mobileRoot || !sidebarRoot) return;

    function setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.page-shell .nav-link');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const linkPage = href.split('/').pop();
            link.classList.toggle('active', linkPage === currentPage);
        });
    }

    function initSearch() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (!['resource.html', 'chats.html'].includes(currentPage)) return;

        const searchInput = document.querySelector('main .head-block input[type="text"]');
        if (!searchInput) return;

        const cards = Array.from(document.querySelectorAll('main .container-fluid > .row > .card-wrapper'));
        if (!cards.length) return;

        const cardsRow = document.querySelector('main .container-fluid > .row');
        let emptyState = cardsRow?.parentElement?.querySelector('.search-empty-state');

        if (!emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'search-empty-state text-muted mt-3';
            emptyState.textContent = 'Ничего не найдено';
            emptyState.style.display = 'none';
            cardsRow?.after(emptyState);
        }

        const applySearch = () => {
            const query = searchInput.value.trim().toLowerCase();
            let visibleCount = 0;

            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const matches = !query || text.includes(query);
                card.style.display = matches ? '' : 'none';
                if (matches) visibleCount += 1;
            });

            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        };

        searchInput.addEventListener('input', applySearch);
        applySearch();
    }

    function loadNavigation() {
        fetch('src/templates/header-nav.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Navigation template could not be loaded');
                }
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const mobileMarkup = doc.querySelector('.nav-mobile-shell')?.outerHTML || '';
                const desktopMarkup = doc.querySelector('.nav-desktop-shell')?.outerHTML || '';

                mobileRoot.outerHTML = mobileMarkup;
                sidebarRoot.outerHTML = desktopMarkup;
                setActiveLink();
                initSearch();

                document.addEventListener('click', function (event) {
                    const link = event.target.closest('.page-shell .nav-link');
                    if (!link) return;

                    setActiveLink();
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    loadNavigation();
    window.addEventListener('load', () => {
                setActiveLink();
                initSearch();
    });
})();
