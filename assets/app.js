(() => {
  const body = document.body;
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const drawerClose = document.querySelector('[data-drawer-close]');
  const langToggles = document.querySelectorAll('[data-lang-toggle]');
  const modal = document.querySelector('[data-modal]');
  const modalOpen = document.querySelector('[data-open-privacy]');
  const modalCloseButtons = document.querySelectorAll('[data-close-modal]');
  const faqItems = [...document.querySelectorAll('.faq-item')];
  const revealItems = document.querySelectorAll('[data-reveal]');
  let lastFocus = null;

  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

  const trapFocus = (container, e) => {
    const focusables = [...container.querySelectorAll(focusableSelector)];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const openDrawer = () => {
    if (!drawer || !backdrop || !burger) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    backdrop.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    body.classList.add('body-lock');
    const firstFocusable = drawer.querySelector(focusableSelector);
    if (firstFocusable) firstFocusable.focus();
  };

  const closeDrawer = () => {
    if (!drawer || !backdrop || !burger) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    body.classList.remove('body-lock');
    if (lastFocus) lastFocus.focus();
  };

  burger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  drawer?.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      if (modal?.classList.contains('active')) closeModal();
    }
    if (e.key === 'Tab' && drawer?.classList.contains('open')) {
      trapFocus(drawer, e);
    }
    if (e.key === 'Tab' && modal?.classList.contains('active')) {
      trapFocus(modal.querySelector('.modal-dialog'), e);
    }
  });

  langToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const wrap = toggle.closest('.lang-dropdown');
      wrap?.classList.toggle('open');
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang-dropdown').forEach((drop) => {
      if (!drop.contains(e.target)) drop.classList.remove('open');
    });
  });

  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach((other) => other !== item && (other.open = false));
    });
  });

  const openModal = () => {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('active');
    body.classList.add('body-lock');
    const first = modal.querySelector(focusableSelector);
    if (first) first.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    body.classList.remove('body-lock');
    if (lastFocus) lastFocus.focus();
  };

  modalOpen?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  modalCloseButtons.forEach((btn) => btn.addEventListener('click', closeModal));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate([{opacity:0, transform:'translateY(20px)'},{opacity:1, transform:'translateY(0)'}], {duration:450, easing:'ease-out', fill:'forwards'});
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});

  revealItems.forEach((item) => {
    item.style.opacity = '0';
    io.observe(item);
  });
})();
