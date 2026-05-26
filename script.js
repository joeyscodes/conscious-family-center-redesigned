/* ============================================
   CONSCIOUS FAMILY CENTRE - PREMIUM SCRIPT
   Full version with all animations & 3D scene
   ============================================ */

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ========== PRELOADER ==========
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => preloader.remove()
      });
    }
  }, 800);
});

// ========== CUSTOM CURSOR ==========
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0,
      ease: 'power2.out'
    });
    gsap.to(cursorFollower, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: 'power2.out'
    });
  });

  // Hover effect on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .program-card, .value-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.style.width = '60px';
      cursorFollower.style.height = '60px';
      cursorFollower.style.borderColor = '#7ED957';
    });
    el.addEventListener('mouseleave', () => {
      cursorFollower.style.width = '40px';
      cursorFollower.style.height = '40px';
      cursorFollower.style.borderColor = '#7ED957';
    });
  });
}

// ========== NAVBAR SCROLL EFFECT ==========
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ========== MOBILE MENU TOGGLE ==========
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });
}

// ========== THREE.JS HERO SCENE ==========
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Floating particles (leafy green)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1200;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 30;
    posArray[i+1] = (Math.random() - 0.5) * 15;
    posArray[i+2] = (Math.random() - 0.5) * 20 - 10;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x7ED957,
    size: 0.06,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Larger leaf particles
  const leafGeometry = new THREE.BufferGeometry();
  const leafCount = 300;
  const leafPosArray = new Float32Array(leafCount * 3);

  for (let i = 0; i < leafCount * 3; i += 3) {
    leafPosArray[i] = (Math.random() - 0.5) * 25;
    leafPosArray[i+1] = (Math.random() - 0.5) * 12;
    leafPosArray[i+2] = (Math.random() - 0.5) * 18 - 8;
  }
  leafGeometry.setAttribute('position', new THREE.BufferAttribute(leafPosArray, 3));

  const leafMaterial = new THREE.PointsMaterial({
    color: 0x4CAF50,
    size: 0.1,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });
  const leafMesh = new THREE.Points(leafGeometry, leafMaterial);
  scene.add(leafMesh);

  camera.position.z = 9;

  let time = 0;
  function animateHero() {
    requestAnimationFrame(animateHero);
    time += 0.003;

    particlesMesh.rotation.y = time * 0.2;
    particlesMesh.rotation.x = Math.sin(time * 0.1) * 0.1;
    leafMesh.rotation.y = -time * 0.15;
    leafMesh.rotation.x = Math.cos(time * 0.08) * 0.1;

    renderer.render(scene, camera);
  }
  animateHero();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ========== GSAP SCROLL REVEAL ANIMATIONS ==========
// Cards, grids, and sections
gsap.utils.toArray('.value-card, .program-card, .activity-item, .about-grid, .contact-info, .contact-note').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.7,
    delay: i * 0.1,
    ease: 'power3.out'
  });
});

// Hero card entrance
gsap.from('.hero-card', {
  duration: 1.2,
  y: 80,
  opacity: 0,
  ease: 'power3.out',
  delay: 0.3
});

// Optional parallax for hero background image (if exists)
const heroBg = document.querySelector('.hero-background-image');
if (heroBg) {
  gsap.to(heroBg, {
    scrollTrigger: {
      scrub: true,
      start: 'top top',
      end: 'bottom top'
    },
    y: 200,
    opacity: 0.2
  });
}

// ========== 3D TILT EFFECT ON CARDS ==========
const tiltCards = document.querySelectorAll('.value-card, .program-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  });
});

// ========== SMOOTH ANCHOR SCROLLING (for single-page sections, if any) ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href !== '#' && href !== '') {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ========== FLOATING ICON ANIMATION (optional) ==========
gsap.utils.toArray('.value-card i, .contact-note i').forEach(icon => {
  gsap.to(icon, {
    y: -5,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });
});

console.log('✅ Conscious Family Centre — Fully loaded with 3D particles, GSAP, and premium interactions');
