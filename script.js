(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navLinks.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    });
    $$('.nav-links a').forEach(link => link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      navLinks.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }));
  }

  // Rotating role text
  const roleTarget = $('#typedRole');
  const roles = ['web experiences', 'responsive websites', 'interactive interfaces', 'ideas into reality'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (roleTarget && !reduceMotion) {
    let roleIndex = 0, letterIndex = roles[0].length, deleting = true;
    const type = () => {
      const current = roles[roleIndex];
      if (deleting) {
        letterIndex--;
        roleTarget.textContent = current.slice(0, Math.max(0, letterIndex));
        if (letterIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
      } else {
        const next = roles[roleIndex];
        letterIndex++;
        roleTarget.textContent = next.slice(0, letterIndex);
        if (letterIndex >= next.length) { deleting = true; window.setTimeout(type, 1500); return; }
      }
      window.setTimeout(type, deleting ? 38 : 65);
    };
    window.setTimeout(type, 1600);
  }

  // Reveal sections on scroll
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  // Gentle 3D tilt for cards and profile; disabled on touch/reduced-motion devices
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const strength = card.id === 'profileStage' ? 8 : 5;
        card.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * strength}deg) rotateY(${(x - 0.5) * strength}deg) translateY(-3px)`;
        card.style.setProperty('--pointer-x', `${x * 100}%`);
        card.style.setProperty('--pointer-y', `${y * 100}%`);
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Scroll progress, header state, back-to-top
  const progress = $('#scrollProgress');
  const header = $('.site-header');
  const backToTop = $('#backToTop');
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  // Active navigation item while scrolling
  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // WhatsApp contact form. Uses the current WhatsApp number shown on the page.
  const contactForm = $('#contactForm');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#name')?.value.trim();
    const email = $('#email')?.value.trim();
    const message = $('#message')?.value.trim();
    if (!name || !email || !message) return;
    const text = `Hello Priyanshu! 👋\n\nName: ${name}\nEmail: ${email}\n\nProject / Message:\n${message}`;
    window.open(`https://wa.me/918709397011?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });

  const year = $('#currentYear');
  if (year) year.textContent = new Date().getFullYear();
})();
