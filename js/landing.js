// ============================
// LoveBox — Landing Page JS
// ============================

// Floating Hearts Background
(function createHearts() {
  const container = document.getElementById('heartsBg');
  const emojis = ['❤️','💕','✨','🌸','💌','🌷','💗','💖','🎀','💝'];
  for (let i = 0; i < 18; i++) {
    const span = document.createElement('span');
    span.className = 'heart-particle';
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
    span.style.animationDuration = (Math.random() * 8 + 7) + 's';
    span.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(span);
  }
})();

// Floating Particles
(function createParticles() {
  const container = document.getElementById('particlesBg');
  for (let i = 0; i < 10; i++) {
    const div = document.createElement('div');
    div.className = 'particle';
    const size = Math.random() * 120 + 60;
    div.style.width = size + 'px';
    div.style.height = size + 'px';
    div.style.left = Math.random() * 100 + 'vw';
    div.style.top = Math.random() * 100 + 'vh';
    div.style.animationDuration = (Math.random() * 6 + 5) + 's';
    div.style.animationDelay = (Math.random() * 4) + 's';
    container.appendChild(div);
  }
})();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// Hero buttons pulse on hover
const heroBtns = document.querySelectorAll('.hero-btn');
heroBtns.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-3px) scale(1.02)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

