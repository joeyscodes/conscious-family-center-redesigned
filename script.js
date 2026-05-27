/* ============================================================
   CONSCIOUS FAMILY CENTRE — script.js
   Animations: Loader, Cursor, Nav, Bubbles (Canvas),
   GSAP Scroll Reveals, Counter, Parallax, Interactions
   ============================================================ */

'use strict';

/* ===========================
   UTILITY
   =========================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const isMobile = () => window.innerWidth < 768;
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===========================
   1. PAGE LOADER
   =========================== */
(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  const minDuration = 1800; // ms
  const start = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const delay = Math.max(0, minDuration - elapsed);
    setTimeout(() => {
      loader.classList.add('done');
      document.body.style.overflow = '';
      initAllAnimations();
    }, delay);
  });

  document.body.style.overflow = 'hidden';
})();

/* ===========================
   2. CUSTOM CURSOR
   =========================== */
(function initCursor() {
  if (isMobile()) return;

  const dot  = $('#cursor');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover expand
  const hoverEls = 'a, button, .prog-card, .why-card, .testi-card, .ca-card, .wws-card, .btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) document.body.classList.remove('cursor-hover');
  });
})();

/* ===========================
   3. NAVBAR SCROLL BEHAVIOUR
   =========================== */
(function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;

  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    lastY = y;
  }, { passive: true });
})();

/* ===========================
   4. HAMBURGER / MOBILE MENU
   =========================== */
(function initMobileMenu() {
  const btn   = $('#hamburger');
  const menu  = $('#mobileNav');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  $$('a', menu).forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ===========================
   5. HERO FLOATING BUBBLES (Canvas)
   =========================== */
(function initBubbles() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, bubbles = [], raf;

  // Brand accent colours for bubbles
  const COLOURS = [
    'rgba(76,175,80,',
    'rgba(244,197,66,',
    'rgba(255,255,255,',
    'rgba(242,140,40,',
    'rgba(52,152,219,',
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeBubble() {
    const r    = Math.random() * 38 + 8;
    const clr  = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    const opacity = Math.random() * 0.14 + 0.04;
    return {
      x:    Math.random() * W,
      y:    H + r + Math.random() * H,
      r,
      vx:   (Math.random() - 0.5) * 0.5,
      vy:   -(Math.random() * 0.55 + 0.25),
      opacity,
      clr,
      phase: Math.random() * Math.PI * 2,
      wobble: Math.random() * 0.4 + 0.1,
    };
  }

  function init() {
    resize();
    bubbles = [];
    const count = isMobile() ? 22 : 45;
    for (let i = 0; i < count; i++) {
      const b = makeBubble();
      b.y = Math.random() * H; // scatter initially
      bubbles.push(b);
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    bubbles.forEach(b => {
      // Wobble horizontal drift
      b.x  += b.vx + Math.sin(t * 0.001 + b.phase) * b.wobble * 0.3;
      b.y  += b.vy;

      // Reset when off-screen
      if (b.y < -b.r * 2) {
        Object.assign(b, makeBubble());
        b.y = H + b.r;
      }
      if (b.x < -b.r)     b.x = W + b.r;
      if (b.x > W + b.r)  b.x = -b.r;

      // Draw bubble
      ctx.save();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);

      // Gradient fill
      const g = ctx.createRadialGradient(
        b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1,
        b.x, b.y, b.r
      );
      g.addColorStop(0, b.clr + (b.opacity * 1.6) + ')');
      g.addColorStop(1, b.clr + '0)');
      ctx.fillStyle = g;
      ctx.fill();

      // Rim highlight
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = b.clr + (b.opacity * 0.6) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });

    raf = requestAnimationFrame(draw);
  }

  if (!prefersReducedMotion()) {
    init();
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  }, { passive: true });
})();

/* ===========================
   6. ALL ANIMATIONS (called after loader done)
   =========================== */
function initAllAnimations() {
  if (prefersReducedMotion()) {
    // Skip animations, just reveal everything
    $$('[data-anim]').forEach(el => el.classList.add('anim-in'));
    return;
  }

  initScrollReveal();
  initHeroAnimations();
  initCounters();
  initParallax();
  initCardHoverTilt();
}

/* ===========================
   6a. SCROLL REVEAL (IntersectionObserver)
   =========================== */
function initScrollReveal() {
  const els = $$('[data-anim]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('anim-in'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ===========================
   6b. HERO ANIMATIONS (GSAP)
   =========================== */
function initHeroAnimations() {
  // Only if GSAP is loaded
  if (typeof gsap === 'undefined') {
    // Fallback: plain CSS reveal
    $$('.hero-badge, .hero-title, .hero-desc, .hero-actions, .hero-stats, .glass-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.65s ease ${i * 0.1}s, transform 0.65s ease ${i * 0.1}s`;
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  const badge  = $('.hero-badge');
  const words  = $$('.hero-word');
  const desc   = $('.hero-desc');
  const acts   = $('.hero-actions');
  const stats  = $('.hero-stats');
  const cards  = $$('.glass-card');

  if (badge) tl.from(badge, { y: 20, opacity: 0, duration: 0.6 }, 0.1);

  if (words.length) {
    tl.from(words, {
      y: '110%',
      opacity: 0,
      stagger: 0.07,
      duration: 0.7,
    }, 0.25);
  } else {
    const title = $('.hero-title');
    if (title) tl.from(title, { y: 30, opacity: 0, duration: 0.7 }, 0.25);
  }

  if (desc)  tl.from(desc,  { y: 22, opacity: 0, duration: 0.6 }, 0.6);
  if (acts)  tl.from(acts,  { y: 18, opacity: 0, duration: 0.5 }, 0.75);
  if (stats) tl.from(stats, { y: 18, opacity: 0, duration: 0.5 }, 0.88);

  if (cards.length) {
    tl.from(cards, {
      y: 40, opacity: 0,
      stagger: 0.15,
      duration: 0.7,
    }, 0.5);
  }

  // Scroll-based parallax on hero mesh
  if (typeof ScrollTrigger !== 'undefined') {
    const mesh = $('.hero-mesh');
    if (mesh) {
      gsap.to(mesh, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }
}

/* ===========================
   6c. COUNTER ANIMATION
   =========================== */
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = target / 50;
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current) + suffix;
        if (current >= target) {
          clearInterval(timer);
          el.textContent = target + suffix;
        }
      }, 28);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ===========================
   6d. SUBTLE PARALLAX ON IMAGES
   =========================== */
function initParallax() {
  if (isMobile()) return;

  const imgs = $$('.ap-main-img img, .as-img-main img, .ca-img img, .prog-img img');
  if (!imgs.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    imgs.forEach(img => {
      const rect = img.closest('[class]').getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top / window.innerHeight) * 20;
      img.style.transform = `translateY(${offset}px) scale(1.06)`;
    });
  }, { passive: true });
}

/* ===========================
   6e. CARD HOVER 3D TILT
   =========================== */
function initCardHoverTilt() {
  if (isMobile()) return;

  const cards = $$('.prog-card, .why-card, .wws-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-9px)
        perspective(600px)
        rotateX(${-y * 7}deg)
        rotateY(${x * 7}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1), box-shadow 0.45s ease';
    });
  });
}

/* ===========================
   7. ACTIVE NAV LINK
   =========================== */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

/* ===========================
   8. SMOOTH SCROLL FOR ANCHOR LINKS
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===========================
   9. IMAGE LAZY LOAD ENHANCEMENT
   (Adds fade-in when images load)
   =========================== */
(function lazyImageFade() {
  const imgs = $$('img');
  imgs.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      img.style.opacity = '1';
      return;
    }
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.55s ease';
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', () => { img.style.opacity = '1'; }); // show fallback
  });
})();

/* ===========================
   10. FOOTER SOCIAL LINK TOOLTIPS
   =========================== */
(function initSocialTooltips() {
  const socials = $$('.f-social');
  socials.forEach(s => {
    s.addEventListener('mouseenter', () => {
      s.style.transform = 'translateY(-4px) scale(1.1)';
    });
    s.addEventListener('mouseleave', () => {
      s.style.transform = '';
    });
  });
})();

/* ===========================
   11. PAGE TRANSITION (subtle)
   =========================== */
(function pageTransition() {
  document.body.style.animation = 'pageFadeIn 0.45s ease forwards';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes pageFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Outgoing transition on internal links
  $$('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('tel:') || href.startsWith('mailto:')) return;

    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.animation = 'pageFadeOut 0.28s ease forwards';

      const fadeOut = `
        @keyframes pageFadeOut {
          to { opacity: 0; transform: translateY(-6px); }
        }
      `;
      const s2 = document.createElement('style');
      s2.textContent = fadeOut;
      document.head.appendChild(s2);

      setTimeout(() => { window.location.href = href; }, 280);
    });
  });
})();

/* ===========================
   12. HERO WORD SPLIT (pure JS, no plugin)
   Wraps each word in hero title spans
   =========================== */
(function splitHeroWords() {
  const lines = $$('.hero-line');
  lines.forEach(line => {
    // Preserve <span class="accent"> inside
    const html = line.innerHTML;
    // Only split if no inner spans (to protect .accent spans)
    if (!line.querySelector('span')) {
      const words = line.textContent.trim().split(' ');
      line.innerHTML = words.map(w => `<span class="hero-word" style="display:inline-block;">${w}&nbsp;</span>`).join('');
    }
  });
})();

/* ===========================
   13. GSAP SCROLL TRIGGERS
   (Only if GSAP + ScrollTrigger loaded)
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Staggered program cards
  const progCards = $$('.prog-card');
  if (progCards.length) {
    gsap.from(progCards, {
      y: 40, opacity: 0,
      stagger: 0.1,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.programs-grid',
        start: 'top 82%',
      },
    });
  }

  // Why cards
  const whyCards = $$('.why-card');
  if (whyCards.length) {
    gsap.from(whyCards, {
      y: 35, opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.why-grid',
        start: 'top 80%',
      },
    });
  }

  // Activity cards
  const caCards = $$('.ca-card');
  if (caCards.length) {
    gsap.from(caCards, {
      y: 45, opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.ca-grid',
        start: 'top 80%',
      },
    });
  }
});
