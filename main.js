/* GroupSolve shared interactions: mobile navigation, hover/tap cards,
   scroll reveals, event filters, and demo-form feedback. */

(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const dropdownItems = [...document.querySelectorAll('.nav-item.has-dropdown')];

  const closeNavigation = () => {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    dropdownItems.forEach((item) => {
      item.classList.remove('is-open');
      item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
  };

  navToggle?.addEventListener('click', () => {
    const opening = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(opening));
    siteNav?.classList.toggle('is-open', opening);
    document.body.classList.toggle('nav-open', opening);
  });

  dropdownItems.forEach((item) => {
    const button = item.querySelector('.dropdown-toggle');
    button?.addEventListener('click', (event) => {
      event.preventDefault();
      const opening = !item.classList.contains('is-open');
      dropdownItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', opening);
      button.setAttribute('aria-expanded', String(opening));
    });
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth > 860) return;
    if (!event.target.closest('.header-inner')) closeNavigation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });

  siteNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) closeNavigation();
  });

  // Volunteer cards: hover works with CSS; click/tap also opens the biography.
  const personCards = [...document.querySelectorAll('.person-card')];
  personCards.forEach((card) => {
    card.addEventListener('click', () => {
      const opening = !card.classList.contains('is-open');
      personCards.forEach((other) => {
        if (other !== card) other.classList.remove('is-open');
      });
      card.classList.toggle('is-open', opening);
      card.setAttribute('aria-expanded', String(opening));
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    });
  });

  // Gentle reveal animation when sections enter the viewport.
  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Event category filters.
  const filterButtons = [...document.querySelectorAll('[data-event-filter]')];
  const eventCards = [...document.querySelectorAll('[data-event-category]')];
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.eventFilter;
      filterButtons.forEach((other) => other.classList.toggle('is-active', other === button));
      eventCards.forEach((card) => {
        card.hidden = filter !== 'all' && card.dataset.eventCategory !== filter;
      });
    });
  });

  // Demo forms: show a clear message instead of pretending data was submitted.
  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Thanks! This demo form is ready to connect to your preferred form service.';
      }
    });
  });

  document.querySelectorAll('[data-current-year]').forEach((item) => {
    item.textContent = new Date().getFullYear();
  });
})();
