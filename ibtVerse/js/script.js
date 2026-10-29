// Shared ibtVerse behaviors. No libraries or build step are required.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');

  // Mobile navigation is keyboard-operable and closes after following a link.
  if (menuButton && menu) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  }

  // Mark the current page link, including links shared across all page headers.
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkFile = link.getAttribute('href')?.split('#')[0];
    if (linkFile === currentFile && !link.hash) link.classList.add('active');
  });

  // Portrait fallback keeps the KI monogram visible when the supplied image is unavailable.
  const portrait = document.querySelector('.portrait-frame img');
  if (portrait) portrait.addEventListener('error', () => { portrait.hidden = true; });

  // Reveal elements as they enter view; reduced-motion visitors see content immediately.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  // Accessible experience tabs: selection, roving tabindex and arrow-key support.
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  function activateTab(tab, moveFocus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      const active = panel.id === tab.getAttribute('aria-controls');
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    if (moveFocus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[next], true);
    });
  });

  // Count-up strip uses the supplied factual totals and only runs once per element.
  const counters = document.querySelectorAll('.counter[data-count]');
  const animateCounter = element => {
    const end = Number(element.dataset.count);
    if (!Number.isFinite(end)) return;
    if (reduceMotion) { element.textContent = String(end); return; }
    const duration = 850;
    const startTime = performance.now();
    const frame = now => {
      const progress = Math.min((now - startTime) / duration, 1);
      element.textContent = String(Math.round(end * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }), { threshold: 0.55 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else counters.forEach(animateCounter);

  // Light, static-count hero particles. The effect is skipped for reduced-motion users.
  const canvas = document.querySelector('.hero-particles');
  if (canvas && !reduceMotion) {
    const context = canvas.getContext('2d');
    if (context) {
      let width = 0;
      let height = 0;
      let points = [];
      const resize = () => {
        const bounds = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = bounds.width;
        height = bounds.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.min(34, Math.max(14, Math.floor(width / 30)));
        points = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.7 + .6,
          speed: Math.random() * .18 + .06,
          alpha: Math.random() * .26 + .1
        }));
      };
      let animationFrame;
      const draw = () => {
        context.clearRect(0, 0, width, height);
        points.forEach(point => {
          point.y -= point.speed;
          if (point.y < -3) { point.y = height + 3; point.x = Math.random() * width; }
          context.beginPath();
          context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(79, 163, 224, ${point.alpha})`;
          context.fill();
        });
        animationFrame = requestAnimationFrame(draw);
      };
      resize();
      draw();
      window.addEventListener('resize', () => { cancelAnimationFrame(animationFrame); resize(); draw(); }, { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animationFrame);
        else draw();
      });
    }
  }

  // Persist the visitor's theme choice. The default stays light until selected.
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = themeToggle?.querySelector('.theme-toggle-icon');
  const themeLabel = themeToggle?.querySelector('.theme-toggle-label');
  const applyTheme = (theme, persist = false) => {
    document.body.dataset.theme = theme;
    const isDark = theme === 'dark';
    themeToggle?.setAttribute('aria-pressed', String(isDark));
    themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    if (themeLabel) themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
    if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☾';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#0b1421' : '#f7fbff');
    if (persist) { try { localStorage.setItem('ibtverse-theme', theme); } catch { /* Storage can be disabled. */ } }
  };
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('ibtverse-theme'); } catch { /* Keep the light default. */ }
  if (savedTheme === 'dark' || savedTheme === 'light') applyTheme(savedTheme);
  themeToggle?.addEventListener('click', () => applyTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark', true));

  // Keep copyright years current on each page.
  document.querySelectorAll('[data-current-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });


  // Highlight the section currently visible beneath the sticky navigation.
  const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')].filter(link => link.hash !== '#top');
  const trackedSections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      sectionLinks.forEach(link => {
        const active = link.hash === `#${visible.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .2, .5] });
    trackedSections.forEach(section => sectionObserver.observe(section));
  }

  // Certificate previews use a native dialog, which closes with Escape by default.
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.dataset.alt || 'Certificate document';
    lightbox.showModal();
  }));
  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

  document.querySelectorAll('.document-preview img').forEach(image => {
    const markMissing = () => image.closest('.document-preview')?.classList.add('image-missing');
    image.addEventListener('error', markMissing);
    if (image.complete && image.naturalWidth === 0) markMissing();
  });
  const projectDialog = document.querySelector('.project-dialog');
  document.querySelectorAll('.project-detail-trigger').forEach(button => button.addEventListener('click', () => {
    if (!projectDialog) return;
    projectDialog.querySelector('h2').textContent = button.dataset.projectTitle || 'Project';
    projectDialog.querySelector('.project-dialog-copy').textContent = button.dataset.projectDescription || '';
    projectDialog.showModal();
  }));
  projectDialog?.querySelector('.lightbox-close')?.addEventListener('click', () => projectDialog.close());
  projectDialog?.addEventListener('click', event => { if (event.target === projectDialog) projectDialog.close(); });

  // No server is required: compose a validated email as a graceful form fallback.
  const contactForm = document.querySelector('#contact-form');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const values = new FormData(contactForm);
    const subject = encodeURIComponent(String(values.get('subject') || 'Portfolio inquiry'));
    const body = encodeURIComponent(`From: ${values.get('name')} (${values.get('email')})\n\n${values.get('message')}`);
    const status = contactForm.querySelector('.form-status');
    if (status) status.textContent = 'Your email application is opening with your message.';
    window.location.href = `mailto:khobiziibtessam@gmail.com?subject=${subject}&body=${body}`;
  });

  // Reveal the back-to-top control only after the visitor has moved down the page.
  const backToTop = document.querySelector('.back-to-top');
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const updateBackToTop = () => {
    backToTop?.classList.toggle('is-visible', window.scrollY > 500);
    if (window.scrollY < 100) {
      sectionLinks.forEach(link => { const home = link.hash === '#top'; link.classList.toggle('active', home); if (home) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    }
  };
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
})();
