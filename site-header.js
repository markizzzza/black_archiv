(() => {
  const mount = document.getElementById('site-header');
  if (!mount || mount.dataset.initialized === 'true') return;
  mount.dataset.initialized = 'true';

  const updateHeaderScrollState = () => {
    mount.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeaderScrollState();
  window.addEventListener('scroll', updateHeaderScrollState, { passive: true });
  window.addEventListener('pageshow', updateHeaderScrollState);
  
  mount.innerHTML = `
    <header class="site-header">
      <nav class="site-header-inner" aria-label="Основная навигация">
        <div class="site-primary-nav">
          <a class="site-nav-link" data-page="cases.html" href="cases.html">Архив дел</a>
          <a class="site-nav-link" data-page="faces.html" href="faces.html">Лица и группировки</a>
          <a class="site-nav-link" data-page="chronicle.html" href="chronicle.html">Хроника</a>
        </div>
        <a class="site-brand" href="index.html" aria-label="Чёрный архив — главная">
          <img src="logo.png" alt="ЧЁРНЫЙ АРХИВ" class="nav-logo">
        </a>
        <div class="site-primary-nav site-primary-nav--right site-header-actions">
          <a class="site-nav-link" data-page="investigation.html" href="investigation.html">Расследование</a>
          <a class="site-nav-link" data-page="media.html" href="media.html">Медиатека</a>
          <button class="site-menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="site-drawer" id="site-menu-toggle">
            <img class="site-menu-icon site-menu-icon-before" src="menu-before.png" alt="" aria-hidden="true">
            <img class="site-menu-icon site-menu-icon-after" src="menu-after.png" alt="" aria-hidden="true">
          </button>
        </div>
      </nav>
    </header>
    <div class="site-drawer-layer" id="site-drawer-layer" aria-hidden="true">
      <button class="site-drawer-backdrop" type="button" aria-label="Закрыть меню" data-close-menu></button>
      <aside class="site-drawer-panel" id="site-drawer" role="dialog" aria-modal="true" aria-labelledby="site-drawer-title" tabindex="-1">
        <div class="site-drawer-head">
          <h2 class="site-drawer-title" id="site-drawer-title">Меню</h2>
          <button class="site-drawer-close" type="button" aria-label="Закрыть меню" data-close-menu><img src="после_нажатия.png" alt="" aria-hidden="true"></button>
        </div>
        <ul class="site-drawer-list">
          <li><a class="site-drawer-link" data-page="index.html" href="index.html">Главная</a></li>
          <li><a class="site-drawer-link" data-page="cases.html" href="cases.html">Архив дел</a></li>
          <li><a class="site-drawer-link" data-page="faces.html" href="faces.html">Лица и группировки</a></li>
          <li><a class="site-drawer-link" data-page="chronicle.html" href="chronicle.html">Хроника</a></li>
          <li><a class="site-drawer-link" data-page="investigation.html" href="investigation.html">Расследование</a></li>
          <li><a class="site-drawer-link" data-page="media.html" href="media.html">Медиатека</a></li>
          <li><a class="site-drawer-link" data-page="documents.html" href="documents.html">Документы</a></li>
          <li><a class="site-drawer-link" data-page="photoarchive.html" href="photoarchive.html">Фотоархив</a></li>
          <li><a class="site-drawer-link" data-page="city_stats.html" href="city_stats.html">Сводка по Городу N</a></li>
          <li><a class="site-drawer-link" data-page="info.html" href="info.html">Общие сведения</a></li>
          <li><a class="site-drawer-link" data-page="contacts.html" href="contacts.html">Контакты</a></li>
        </ul>
      </aside>
    </div>`;

  const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const activePage = ({'article.html':'cases.html','article2.html':'cases.html','article3.html':'cases.html','dcdsvs.html':'city_stats.html'})[page] || page;
  mount.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page.toLowerCase() === activePage) link.setAttribute('aria-current', 'page');
  });

  const layer = mount.querySelector('#site-drawer-layer');
  const toggle = mount.querySelector('#site-menu-toggle');
  const panel = mount.querySelector('#site-drawer');
  const closeButtons = mount.querySelectorAll('[data-close-menu]');
  let previousFocus = null;

  function setMenuOpen(open) {
    layer.classList.toggle('is-open', open);
    layer.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.documentElement.classList.toggle('site-menu-open', open);
    if (open) {
      previousFocus = document.activeElement;
      panel.focus();
    } else if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }

  toggle.addEventListener('click', () => setMenuOpen(!layer.classList.contains('is-open')));
  closeButtons.forEach(button => button.addEventListener('click', () => setMenuOpen(false)));
  mount.querySelectorAll('.site-drawer-link').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && layer.classList.contains('is-open')) setMenuOpen(false);
  });
})();

// Обе иллюстрации книги переключаются в обе стороны. Код находится
// в общем скрипте, чтобы на всех страницах использовался один источник логики.
document.addEventListener('DOMContentLoaded', () => {
  const mainBook = document.getElementById('book-animation');
  if (mainBook && mainBook.dataset.initialized !== 'true') {
    mainBook.dataset.initialized = 'true';
    const status = document.getElementById('book-animation-status');
    mainBook.addEventListener('click', () => {
      const isOpen = mainBook.classList.toggle('is-open');
      mainBook.setAttribute('aria-pressed', String(isOpen));
      mainBook.setAttribute('aria-label', isOpen ? 'Свернуть открытую книгу' : 'Раскрыть стопку книг');
      if (status) status.textContent = isOpen
        ? 'Книга раскрыта — нажмите ещё раз, чтобы сложить её обратно.'
        : 'Нажмите на стопку книг, чтобы раскрыть архив.';
    });
  }

  const archiveBook = document.getElementById('archiveBookToggle');
  if (archiveBook && archiveBook.dataset.initialized !== 'true') {
    archiveBook.dataset.initialized = 'true';
    const hint = document.getElementById('archiveBookHint');
    archiveBook.addEventListener('click', () => {
      const isOpen = archiveBook.classList.toggle('is-open');
      archiveBook.setAttribute('aria-pressed', String(isOpen));
      archiveBook.setAttribute('aria-label', isOpen ? 'Сложить книгу' : 'Раскрыть книгу');
      if (hint) hint.textContent = isOpen ? 'Нажмите, чтобы сложить книгу обратно' : 'Нажмите, чтобы раскрыть книгу';
    });
  }
});
