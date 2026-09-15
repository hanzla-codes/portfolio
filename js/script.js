(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const revealElements = [...document.querySelectorAll('.reveal')];
  const backToTop = document.getElementById('backToTop');
  const year = document.getElementById('year');
  const toast = document.getElementById('toast');
  const contactForm = document.getElementById('contactForm');
  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const projectCards = [...document.querySelectorAll('.project-card')];

  year.textContent = new Date().getFullYear();

  const setMenu = (open) => {
    navLinks.classList.toggle('open', open);
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    document.body.classList.toggle('menu-open', open);
  };

  menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navAnchors.forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const handleScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 18);
    backToTop.classList.toggle('visible', y > 640);

    let current = 'home';
    sections.forEach((section) => {
      if (y >= section.offsetTop - 180) current = section.id;
    });
    navAnchors.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -45px' })
    : null;

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add('visible');
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      projectCards.forEach((card) => {
        const visible = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !visible);
      });
    });
  });

  let toastTimer;
  const showToast = (message) => {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  };

  document.querySelectorAll('.placeholder-link[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showToast(`Replace this placeholder with your ${link.dataset.placeholder || 'real URL'} before publishing.`);
    });
  });

  const validateField = (field) => {
    const wrapper = field.closest('.field');
    const error = wrapper?.querySelector('.error');
    let message = '';
    const value = field.value.trim();

    if (!value) message = 'This field is required.';
    else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Enter a valid email address.';
    else if (field.id === 'message' && value.length < 12) message = 'Please enter at least 12 characters.';

    wrapper?.classList.toggle('invalid', Boolean(message));
    if (error) error.textContent = message;
    return !message;
  };

  contactForm.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.field')?.classList.contains('invalid')) validateField(field);
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = [...contactForm.querySelectorAll('input, textarea')];
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      showToast('Please fix the highlighted fields.');
      return;
    }

    const data = new FormData(contactForm);
    const subject = encodeURIComponent(data.get('subject'));
    const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    window.location.href = `mailto:muhammadhanzla1378@gmail.com?subject=${subject}&body=${body}`;
    showToast('Opening your email app.');
  });
})();
