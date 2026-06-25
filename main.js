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

/* ===== MOBILE MENU (simple toggle) ===== */
const toggle = document.querySelector('.nav__menu-toggle');
const mobileOverlay = document.querySelector('.nav__mobile');
if (toggle && mobileOverlay) {
  toggle.addEventListener('click', () => {
    mobileOverlay.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });
}
