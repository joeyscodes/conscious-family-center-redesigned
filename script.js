// CONSCIOUS FAMILY CENTRE - CINEMATIC SCRIPT (FULL)
gsap.registerPlugin(ScrollTrigger);

// Preloader
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      gsap.to(preloader, { opacity: 0, duration: 0.6, onComplete: () => preloader.remove() });
    }
  }, 800);
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
if (cursor && follower) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.15 });
  });
  const interactive = document.querySelectorAll('a, button, .btn, .program-card, .value-card, .activity-item');
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width = '60px';
      follower.style.height = '60px';
      follower.style.borderColor = '#7ED957';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width = '40px';
      follower.style.height = '40px';
      follower.style.borderColor = '#7ED957';
    });
  });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// Mobile menu
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');
if (toggle && menu) {
  toggle.addEventListener('click', () => menu.classList.toggle('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => menu.classList.remove('active')));
}

// Three.js Hero Scene (floating particles + leaves)
const canvas = document.getElementById('hero-canvas');
if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Small particles
  const particleCount = 1200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePos[i*3] = (Math.random() - 0.5) * 30;
    particlePos[i*3+1] = (Math.random() - 0.5) * 15;
    particlePos[i*3+2] = (Math.random() - 0.5) * 20 - 10;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x7ED957, size: 0.06, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Larger leaf-like particles
  const leafCount = 300;
  const leafGeo = new THREE.BufferGeometry();
  const leafPos = new Float32Array(leafCount * 3);
  for (let i = 0; i < leafCount; i++) {
    leafPos[i*3] = (Math.random() - 0.5) * 25;
    leafPos[i*3+1] = (Math.random() - 0.5) * 12;
    leafPos[i*3+2] = (Math.random() - 0.5) * 18 - 8;
  }
  leafGeo.setAttribute('position', new THREE.BufferAttribute(leafPos, 3));
  const leafMat = new THREE.PointsMaterial({ color: 0x4CAF50, size: 0.1, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
  const leaves = new THREE.Points(leafGeo, leafMat);
  scene.add(leaves);

  camera.position.z = 9;
  let time = 0;
  function animateScene() {
    requestAnimationFrame(animateScene);
    time += 0.003;
    particles.rotation.y = time * 0.2;
    particles.rotation.x = Math.sin(time * 0.1) * 0.1;
    leaves.rotation.y = -time * 0.15;
    leaves.rotation.x = Math.cos(time * 0.08) * 0.1;
    renderer.render(scene, camera);
  }
  animateScene();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// GSAP scroll-triggered reveals
gsap.utils.toArray('.value-card, .program-card, .activity-item, .about-grid, .contact-info, .contact-note').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 50,
    opacity: 0,
    duration: 0.7,
    delay: i * 0.1,
    ease: 'power3.out'
  });
});

// Hero card entrance animation
gsap.from('.hero-card', { duration: 1.2, y: 80, opacity: 0, ease: 'power3.out', delay: 0.3 });

// Parallax effect on hero background image
gsap.to('.hero-background-image', {
  scrollTrigger: { scrub: true, start: 'top top', end: 'bottom top' },
  y: 200,
  opacity: 0.2
});

// 3D tilt effect on cards
document.querySelectorAll('.value-card, .program-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Smooth anchor scrolling (for any # links)
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

console.log('Conscious Family Centre - Cinematic Experience Ready');
