// ============================
// LoveBox — Experience JS
// The Girlfriend's Surprise
// ============================

// ---- Load Data ----
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('id');
let data = null;

// Demo fallback data
const demoData = {
  gfName: 'Priya',
  bfName: 'Arjun',
  message: "Every morning I wake up and think of you first. You are the reason I smile a little wider, laugh a little more, and love a lot harder. I don't know what I did to deserve someone as beautiful, kind, and wonderful as you — but I'll spend every day being grateful. You are my favorite adventure, and I never want it to end.",
  specialDate: '2023-02-14',
  theme: 'rose',
  music: 'romantic_piano',
  photos: [], // Will use placeholders
};

// ---- Theme Config ----
const themes = {
  rose:     { bg: 'linear-gradient(160deg, #2d1024 0%, #1a0a14 45%, #0f0520 100%)', accent: 'rgba(244,114,182,0.3)' },
  lavender: { bg: 'linear-gradient(160deg, #1e0a4a 0%, #0f0520 50%, #0a0020 100%)', accent: 'rgba(167,139,250,0.35)' },
  midnight: { bg: 'linear-gradient(160deg, #000510 0%, #0a0020 50%, #1a0010 100%)', accent: 'rgba(244,114,182,0.2)' },
  golden:   { bg: 'linear-gradient(160deg, #1a0a00 0%, #2d1a00 50%, #0f0800 100%)', accent: 'rgba(245,158,11,0.35)' },
  sakura:   { bg: 'linear-gradient(160deg, #2d0a20 0%, #1a0514 50%, #0f020a 100%)', accent: 'rgba(236,72,153,0.35)' },
  ocean:    { bg: 'linear-gradient(160deg, #041a2d 0%, #020f1a 50%, #001020 100%)', accent: 'rgba(56,189,248,0.3)' },
};
let theme = themes.rose;

// ---- Music Config ----
const musicFiles = {
  // Royalty-free music from Pixabay CDN (free tier)
  romantic_piano: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
  acoustic_love:  'https://cdn.pixabay.com/audio/2022/01/20/audio_d0c1e82bc4.mp3',
  dreamy_ambient: 'https://cdn.pixabay.com/audio/2022/03/22/audio_d1718ab41b.mp3',
  lofi_romance:   'https://cdn.pixabay.com/audio/2021/09/27/audio_1e8e49ab12.mp3',
};

// ---- State ----
let musicStarted = false;
let musicMuted = false;
let balloonPopped = false;
let finalSectionVisible = false;

// ============================
// INIT
// ============================
window.addEventListener('DOMContentLoaded', async () => {
  if (uid) {
    try {
      // Fetch from custom Node.js backend
      const res = await fetch('/api/surprises/' + uid);
      if (!res.ok) throw new Error('Not found in backend');
      
      const dbData = await res.json();
      
      data = {
        gfName: dbData.gfName,
        bfName: dbData.bfName,
        message: dbData.message,
        specialDate: dbData.specialDate,
        theme: dbData.theme,
        music: dbData.music,
        photos: dbData.photos || []
      };
    } catch (err) {
      console.error("Backend Error / Falling back to localStorage:", err);
      try {
        const stored = localStorage.getItem('lb_' + uid);
        data = stored ? JSON.parse(stored) : demoData;
      } catch(e) {
        data = demoData;
      }
    }
  } else {
    data = demoData;
  }

  // Set theme from data
  theme = themes[data.theme] || themes.rose;

  applyTheme();
  initHearts();
  initSparkles();
  injectData();
  initGateParticles();
  initGatePhotosPeek();
  setupScrollReveal();
  setupMusicToggle();
  setupBalloon();
  initFinalStars();
  initFinalHearts();
});

// ---- Apply Theme ----
function applyTheme() {
  const sections = document.querySelectorAll('.gate-bg, .opening-bg, .balloon-bg, .final-bg, .letter-bg');
  document.querySelector('.gate-bg').style.background = theme.bg;
  document.querySelector('.gate-gradient').style.background = `radial-gradient(ellipse at 50% 40%, ${theme.accent}, transparent 65%)`;
  document.querySelector('.final-bg').style.background = theme.bg;
  document.querySelector('.final-gradient').style.background = `radial-gradient(ellipse at 50% 40%, ${theme.accent}, transparent 65%)`;
}

// ---- Inject Data ----
function injectData() {
  const name = data.gfName || 'Beautiful';
  const bf   = data.bfName;
  const msg  = data.message || '';
  const date = data.specialDate;

  document.getElementById('gateName').textContent = 'Hey ' + name + ' ❤️';
  document.getElementById('openingName').textContent = 'Hey ' + name + ' ❤️';
  document.getElementById('finalName').textContent = name + ' ❤️';
  document.getElementById('letterTo').textContent = 'To ' + name + ',';

  // Letter signature
  if (bf) {
    document.getElementById('letterSig').textContent = '— with love, ' + bf + ' ❤️';
    document.getElementById('finalFrom').textContent = '— With love, ' + bf;
  }

  // Special date
  if (date) {
    const d = new Date(date);
    document.getElementById('letterDate').textContent = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Photo gallery
  buildGallery(data.photos || []);
}

// ---- Gallery ----
const polaroidCaptions = [
  'My favorite smile 🌸', 'This is my happy place 💕', 'Us ❤️',
  'Always ✨', 'Golden memories 🌟', 'My whole world 🌍',
  'Together 💌', 'Forever like this 🎀',
];

function buildGallery(photos) {
  const gallery = document.getElementById('photosGallery');
  const rotations = [-4, 2, -2, 4, -3, 3, -1, 2];

  if (photos.length === 0) {
    // Show placeholder cards in demo mode
    for (let i = 0; i < 6; i++) {
      const rot = rotations[i % rotations.length];
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.style.setProperty('--rot', rot + 'deg');
      card.style.transitionDelay = (i * 0.12) + 's';
      // Gradient placeholder image
      const colors = ['#fce7f3,#f472b6', '#ede9fe,#a78bfa', '#fce7f3,#f43f5e', '#ede9fe,#f472b6', '#fce7f3,#a78bfa', '#f0fdf4,#86efac'];
      card.innerHTML = `
        <div class="polaroid-img" style="background:linear-gradient(135deg,${colors[i % colors.length]});display:flex;align-items:center;justify-content:center;font-size:2.5rem;">
          ${ ['💕','✨','❤️','🌸','💌','🎀'][i % 6] }
        </div>
        <div class="polaroid-caption">${polaroidCaptions[i % polaroidCaptions.length]}</div>
      `;
      gallery.appendChild(card);
    }
  } else {
    photos.forEach((src, i) => {
      const rot = rotations[i % rotations.length];
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.style.setProperty('--rot', rot + 'deg');
      card.style.transitionDelay = (i * 0.12) + 's';
      const img = document.createElement('img');
      img.className = 'polaroid-img';
      img.src = src;
      img.alt = 'Memory ' + (i + 1);
      const cap = document.createElement('div');
      cap.className = 'polaroid-caption';
      cap.textContent = polaroidCaptions[i % polaroidCaptions.length];
      card.appendChild(img);
      card.appendChild(cap);
      gallery.appendChild(card);
    });
  }

  // Add photo peeks to gate (first 3 photos)
  const peeksContainer = document.getElementById('gatePhotoPeeks');
  const peekPositions = [
    { top: '15%', left: '5%', rotate: '-8deg' },
    { top: '20%', right: '5%', rotate: '6deg' },
    { bottom: '25%', left: '8%', rotate: '4deg' },
  ];
  const peekSrcs = photos.length > 0 ? photos.slice(0, 3) : [];
  peeksContainer.querySelectorAll('.photo-peek').forEach(el => el.remove());
  peekSrcs.forEach((src, i) => {
    const pos = peekPositions[i];
    const img = document.createElement('img');
    img.className = 'photo-peek';
    img.src = src;
    img.alt = '';
    Object.assign(img.style, pos);
    if (pos.rotate) img.style.transform = `rotate(${pos.rotate})`;
    peeksContainer.appendChild(img);
  });
}

// ---- Gate Open Button ----
document.getElementById('openBtn').addEventListener('click', () => {
  // Start music on first interaction
  startMusic();
  
  // Scroll to opening section smoothly
  const opening = document.getElementById('sectionOpening');
  opening.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ---- Gate Particles ----
function initGateParticles() {
  const container = document.getElementById('gateParticles');
  for (let i = 0; i < 6; i++) {
    const size = Math.random() * 120 + 60;
    const el = document.createElement('div');
    el.className = 'gp';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.top  = (Math.random() * 100) + 'vh';
    el.style.animationDuration = (Math.random() * 8 + 6) + 's';
    el.style.animationDelay = (Math.random() * 4) + 's';
    container.appendChild(el);
  }
}

// ---- Gate Photo Peeks ----
function initGatePhotosPeek() {
  // placeholder — actual peeks set in buildGallery
}

// ---- Floating Hearts ----
function initHearts() {
  const container = document.getElementById('heartsBg');
  const emojis = ['❤️','💕','✨','🌸','💌','🌷','💗','💖','🎀'];
  for (let i = 0; i < 14; i++) {
    const span = document.createElement('span');
    span.className = 'heart-p';
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.fontSize = (Math.random() * 1 + 0.6) + 'rem';
    span.style.animationDuration = (Math.random() * 10 + 8) + 's';
    span.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(span);
  }
}

// ---- Sparkles ----
function initSparkles() {
  const container = document.getElementById('sparklesBg');
  for (let i = 0; i < 30; i++) {
    const sp = document.createElement('div');
    sp.className = 'sparkle';
    sp.style.left = Math.random() * 100 + 'vw';
    sp.style.top  = Math.random() * 100 + 'vh';
    sp.style.animationDuration = (Math.random() * 3 + 1.5) + 's';
    sp.style.animationDelay = (Math.random() * 4) + 's';
    sp.style.width = sp.style.height = (Math.random() * 3 + 1) + 'px';
    container.appendChild(sp);
  }
}

// ---- Final Stars ----
function initFinalStars() {
  const container = document.getElementById('finalStars');
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top  = Math.random() * 100 + '%';
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    star.style.animationDelay = (Math.random() * 5) + 's';
    star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
    container.appendChild(star);
  }
}

// ---- Final Hearts ----
function initFinalHearts() {
  const container = document.getElementById('finalHeartsAnim');
  const emojis = ['❤️','💕','✨','🌸'];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('span');
    el.className = 'fha-heart';
    el.textContent = emojis[i % emojis.length];
    el.style.left = (10 + Math.random() * 80) + '%';
    el.style.bottom = (Math.random() * 40) + '%';
    el.style.animationDuration = (Math.random() * 4 + 3) + 's';
    el.style.animationDelay = (Math.random() * 6) + 's';
    container.appendChild(el);
  }
}

// ---- Scroll Reveal ----
function setupScrollReveal() {
  const observers = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('visible');
        
        // Special handling
        if (el.classList.contains('letter-text')) startTypewriter();
        if (el.classList.contains('balloon-prompt')) triggerBalloonSection();
        if (el.id === 'finalName') triggerFinalSection();
        
        observers.unobserve(el);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  const toReveal = [
    document.getElementById('openingName'),
    document.querySelector('.opening-text'),
    document.querySelector('.balloon-prompt'),
    document.querySelector('.letter-to'),
    document.querySelector('.letter-sig'),
    document.getElementById('finalName'),
    document.querySelector('.final-line1'),
    document.querySelector('.final-line2'),
    document.querySelector('.final-occasion'),
    document.getElementById('finalFrom'),
  ];
  toReveal.forEach(el => { if (el) observers.observe(el); });

  // Polaroid cards
  const polaroidObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        polaroidObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  
  setTimeout(() => {
    document.querySelectorAll('.polaroid-card').forEach(el => polaroidObs.observe(el));
  }, 300);

  // Letter text (typewriter trigger)
  const letterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startTypewriter();
        letterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  const letterSection = document.getElementById('sectionLetter');
  if (letterSection) letterObs.observe(letterSection);
}

// ---- Typewriter Effect ----
let typewriterDone = false;
function startTypewriter() {
  if (typewriterDone) return;
  typewriterDone = true;
  
  const letterTextEl = document.getElementById('letterText');
  const cursor = document.getElementById('letterCursor');
  const msg = data.message || 'You are my world. Every single day.';
  const sig = document.querySelector('.letter-sig');
  
  let i = 0;
  letterTextEl.textContent = '';
  const speed = Math.max(20, Math.min(60, 3000 / msg.length));
  
  function type() {
    if (i < msg.length) {
      letterTextEl.textContent += msg.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Typing done — hide cursor after pause, show signature
      setTimeout(() => {
        cursor.style.display = 'none';
        if (sig) sig.classList.add('visible');
      }, 800);
    }
  }
  type();
}

// ---- Balloon ----
function setupBalloon() {
  const balloon = document.getElementById('mainBalloon');
  if (!balloon) return;
  balloon.addEventListener('click', popBalloon);
  balloon.addEventListener('touchstart', (e) => { e.preventDefault(); popBalloon(); });
}

function triggerBalloonSection() {
  // Nothing extra needed; balloon waits for tap
}

function popBalloon() {
  if (balloonPopped) return;
  balloonPopped = true;

  const balloon = document.getElementById('mainBalloon');
  const tap = document.querySelector('.balloon-tap');
  const revealed = document.getElementById('balloonRevealed');

  // Pop animation
  balloon.classList.add('popping');
  if (tap) tap.style.display = 'none';

  // Burst hearts
  spawnBurst();
  // Confetti
  spawnConfetti();
  // Falling Hearts
  spawnFallingHearts();
  // Romantic Gifts Pop Up
  spawnGifts();
  
  // Show revealed message
  setTimeout(() => {
    balloon.style.display = 'none';
    revealed.classList.add('show');
  }, 700);

  // Extra confetti burst
  setTimeout(spawnConfetti, 1000);
}

function spawnBurst() {
  const container = document.getElementById('burstContainer');
  const emojis = ['❤️','💕','✨','🌸','💖','💗','💝','🎈'];
  const rect = document.getElementById('mainBalloon').getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 20; i++) {
    const el = document.createElement('span');
    el.className = 'burst-piece';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (Math.PI * 2 * i) / 20;
    const dist = Math.random() * 180 + 80;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 40;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');
    el.style.animationDuration = (Math.random() * 0.6 + 0.7) + 's';
    el.style.animationDelay = (Math.random() * 0.1) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
}

function spawnConfetti() {
  const container = document.getElementById('confettiContainer');
  const colors = ['#f472b6','#a78bfa','#f43f5e','#fbbf24','#34d399','#60a5fa'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.width = (Math.random() * 8 + 4) + 'px';
    el.style.height = (Math.random() * 8 + 4) + 'px';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.animationDuration = (Math.random() * 2 + 2) + 's';
    el.style.animationDelay = (Math.random() * 0.5) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}

function spawnFallingHearts() {
  const container = document.getElementById('burstContainer');
  const emojis = ['💖','💕','✨','🌸','❤️'];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('span');
    el.className = 'falling-heart-anim';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.top = '-10vh';
    el.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
    el.style.animationDuration = (Math.random() * 3 + 2) + 's';
    el.style.animationDelay = (Math.random() * 0.5) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

function spawnGifts() {
  const container = document.getElementById('burstContainer');
  const gifts = ['🎁','💐','🧸','🍫','💍','🌹'];
  const rect = document.getElementById('mainBalloon').getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 10; i++) {
    const el = document.createElement('span');
    el.className = 'gift-piece';
    el.textContent = gifts[Math.floor(Math.random() * gifts.length)];
    const angle = (Math.PI * 2 * i) / 10;
    const dist = Math.random() * 150 + 100;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 80;
    el.style.left = cx + 'px';
    el.style.top  = cy + 'px';
    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');
    el.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
    el.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
    el.style.animationDelay = (Math.random() * 0.2) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

// ---- Final Section ----
function triggerFinalSection() {
  if (finalSectionVisible) return;
  finalSectionVisible = true;
  // All visible classes applied by scroll observer
}

// ---- Music ----
function startMusic() {
  if (musicStarted || data.music === 'none') return;
  musicStarted = true;
  
  const audio = document.getElementById('bgAudio');
  const musicFile = musicFiles[data.music];
  if (!musicFile) return;
  
  audio.src = musicFile;
  audio.volume = 0;
  audio.play().then(() => {
    // Fade in
    let vol = 0;
    const fadeIn = setInterval(() => {
      vol = Math.min(vol + 0.02, 0.35);
      audio.volume = vol;
      if (vol >= 0.35) clearInterval(fadeIn);
    }, 100);
    document.getElementById('musicIconAnim').classList.add('playing');
  }).catch(() => {
    // Autoplay blocked — user will need to manually enable
    document.getElementById('musicToggle').style.display = 'flex';
  });
}

function setupMusicToggle() {
  const toggle = document.getElementById('musicToggle');
  if (data.music === 'none') {
    toggle.style.display = 'none';
    return;
  }
  toggle.addEventListener('click', () => {
    const audio = document.getElementById('bgAudio');
    const icon = document.getElementById('musicIconAnim');
    
    if (!musicStarted) {
      startMusic();
      return;
    }
    
    if (musicMuted) {
      audio.volume = 0.35;
      musicMuted = false;
      icon.textContent = '🎵';
      icon.classList.add('playing');
      toggle.classList.remove('muted');
    } else {
      audio.volume = 0;
      musicMuted = true;
      icon.textContent = '🔇';
      icon.classList.remove('playing');
      toggle.classList.add('muted');
    }
  });
}
