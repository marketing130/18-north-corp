/* ===== NAV SCROLL BEHAVIOR ===== */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===== FADE-UP ON SCROLL ===== */
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
fadeEls.forEach(el => observer.observe(el));

/* ===== STAGGERED CHILDREN ===== */
document.querySelectorAll('[data-stagger]').forEach(parent => {
  const children = parent.children;
  Array.from(children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 120}ms`;
  });
});

/* ===== STAT COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 1800;

  /* Lock the element width in `ch` units (full final value is in the HTML
     before JS runs) so the layout never shifts as digits change, and the
     lock still scales correctly if the viewport is resized afterward. */
  el.style.minWidth = el.textContent.length + 'ch';

  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

/* ===== DROPDOWN MENUS ===== */
document.querySelectorAll('.nav__dropdown-wrap').forEach(wrap => {
  const trigger = wrap.querySelector('.nav__dropdown-trigger');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = wrap.classList.contains('open');
    // Close all open dropdowns first
    document.querySelectorAll('.nav__dropdown-wrap.open').forEach(w => {
      w.classList.remove('open');
      w.querySelector('.nav__dropdown-trigger').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      wrap.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.nav__dropdown-wrap.open').forEach(w => {
    w.classList.remove('open');
    w.querySelector('.nav__dropdown-trigger').setAttribute('aria-expanded', 'false');
  });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav__dropdown-wrap.open').forEach(w => {
      w.classList.remove('open');
      w.querySelector('.nav__dropdown-trigger').setAttribute('aria-expanded', 'false');
    });
  }
});

/* ===== LIGHTBOX ===== */
(function () {
  const lightbox   = document.getElementById('lightbox');
  if (!lightbox) return;
  const lbImg      = lightbox.querySelector('.lightbox__img');
  const triggers   = Array.from(document.querySelectorAll('.lightbox-trigger'));

  const images = triggers.map(t => {
    const img = t.querySelector('img');
    return { src: img.src, alt: img.alt };
  });

  let current = 0;

  function show(index) {
    current = (index + images.length) % images.length;
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function hide() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach((t, i) => t.addEventListener('click', () => show(i)));
  lightbox.querySelector('.lightbox__close').addEventListener('click', hide);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
  lightbox.querySelector('.lightbox__next').addEventListener('click', e => { e.stopPropagation(); show(current + 1); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) hide(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

/* ===== MOBILE MENU (simple toggle) ===== */
const toggle = document.querySelector('.nav__menu-toggle');
const mobileOverlay = document.querySelector('.nav__mobile');
if (toggle && mobileOverlay) {
  const closeMobileMenu = () => {
    mobileOverlay.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };
  toggle.addEventListener('click', () => {
    const isOpen = mobileOverlay.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('no-scroll', isOpen);
  });
  mobileOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}
