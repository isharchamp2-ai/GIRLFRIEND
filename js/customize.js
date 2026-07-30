// ============================
// LoveBox — Customize Page JS
// ============================

// ---------- State ----------
const state = {
  userEmail: '',
  gfName: '',
  bfName: '',
  message: '',
  specialDate: '',
  photos: [], // File objects
  photoPreviews: [], // data URLs
  theme: 'rose',
  music: 'none',
};

const themeConfig = {
  rose:     { bg: 'linear-gradient(160deg, #2d1024 0%, #1a0a14 40%, #0f0520 100%)', accent: 'rgba(244,114,182,0.4)', label: 'Rose Dream' },
  lavender: { bg: 'linear-gradient(160deg, #1e0a4a 0%, #0f0520 50%, #0a0020 100%)', accent: 'rgba(167,139,250,0.4)', label: 'Lavender Mist' },
  midnight: { bg: 'linear-gradient(160deg, #000510 0%, #0a0020 50%, #1a0010 100%)', accent: 'rgba(244,114,182,0.25)', label: 'Midnight Magic' },
  golden:   { bg: 'linear-gradient(160deg, #1a0a00 0%, #2d1a00 50%, #0f0800 100%)', accent: 'rgba(245,158,11,0.4)', label: 'Golden Hour' },
  sakura:   { bg: 'linear-gradient(160deg, #2d0a20 0%, #1a0514 50%, #0f020a 100%)', accent: 'rgba(236,72,153,0.4)', label: 'Sakura Spring' },
  ocean:    { bg: 'linear-gradient(160deg, #041a2d 0%, #020f1a 50%, #001020 100%)', accent: 'rgba(56,189,248,0.4)', label: 'Ocean Dreamer' },
};
const musicConfig = {
  none: 'No Music',
  romantic_piano: 'Romantic Piano',
  acoustic_love: 'Acoustic Love',
  dreamy_ambient: 'Dreamy Ambient',
  lofi_romance: 'Lo-fi Romance',
};

// ---------- Init ----------
window.addEventListener('DOMContentLoaded', () => {
  setupInputListeners();
  setupUploadZone();
  setupThemeSelect();
  setupMusicSelect();
});

// ---------- Inputs ----------
function setupInputListeners() {
  // Names
  const gfInput = document.getElementById('gfName');
  const msgInput = document.getElementById('loveMessage');
  const gfCount = document.getElementById('gfNameCount');
  const msgCount = document.getElementById('msgCount');

  document.getElementById('userEmail').addEventListener('input', (e) => {
    state.userEmail = e.target.value.trim();
  });
  
  gfInput.addEventListener('input', () => {
    state.gfName = gfInput.value.trim();
    gfCount.textContent = gfInput.value.length + '/40';
    updatePreview();
  });
  document.getElementById('bfName').addEventListener('input', (e) => {
    state.bfName = e.target.value.trim();
    updatePreview();
  });
  msgInput.addEventListener('input', () => {
    state.message = msgInput.value.trim();
    msgCount.textContent = msgInput.value.length + '/500';
    updatePreview();
  });
  document.getElementById('specialDate').addEventListener('change', (e) => {
    state.specialDate = e.target.value;
  });
}

// ---------- Upload Zone ----------
function setupUploadZone() {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('photoInput');

  zone.addEventListener('click', () => input.click());

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    addPhotos(files);
  });

  input.addEventListener('change', () => {
    addPhotos(Array.from(input.files));
    input.value = '';
  });
}

function addPhotos(files) {
  const maxPhotos = 8;
  const remaining = maxPhotos - state.photos.length;
  const toAdd = files.slice(0, remaining);
  toAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.photos.push(file);
      state.photoPreviews.push(e.target.result);
      renderPhotoGrid();
      updatePhotoCount();
      updatePreview();
    };
    reader.readAsDataURL(file);
  });
}

function removePhoto(idx) {
  state.photos.splice(idx, 1);
  state.photoPreviews.splice(idx, 1);
  renderPhotoGrid();
  updatePhotoCount();
  updatePreview();
}

function renderPhotoGrid() {
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = '';
  state.photoPreviews.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'photo-thumb';
    div.innerHTML = `<img src="${src}" alt="Photo ${i+1}" />
      <button class="remove-photo" onclick="removePhoto(${i})">✕</button>`;
    grid.appendChild(div);
  });
}

function updatePhotoCount() {
  const cnt = state.photos.length;
  const el = document.getElementById('photoCount');
  el.textContent = `${cnt} of 3–8 photos added`;
  el.style.color = cnt >= 3 ? '#16a34a' : 'var(--text-muted)';
}

// ---------- Theme ----------
function setupThemeSelect() {
  document.getElementById('themesGrid').addEventListener('click', (e) => {
    const card = e.target.closest('.theme-card');
    if (!card) return;
    document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    state.theme = card.dataset.theme;
    updatePreview();
  });
}

// ---------- Music ----------
function setupMusicSelect() {
  document.getElementById('musicOptions').addEventListener('click', (e) => {
    const card = e.target.closest('.music-card');
    if (!card) return;
    document.querySelectorAll('.music-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    state.music = card.dataset.music;
    updatePreview();
  });
}

// ---------- Live Preview ----------
function updatePreview() {
  // We keep this function as a no-op so the demo sample remains constant
  // Demo sample will not change based on user input.
}

// ---------- Generate Preview ----------
window.generatePreview = function() {
  const errors = [];
  if (!state.userEmail) errors.push("Please enter your email");
  if (!state.gfName) errors.push("Please enter her name");
  if (!state.message) errors.push("Please write a message for her");
  if (state.photos.length < 3) errors.push("Please add at least 3 photos");

  if (errors.length > 0) {
    alert('Missing details:\n\n' + errors.join('\n'));
    return;
  }

  // Upload data first, then open payment modal
  uploadDataFirst();
};

window.uploadDataFirst = async function() {
  const proceedBtn = document.getElementById('previewBtn');
  const oldText = proceedBtn.innerHTML;
  proceedBtn.innerHTML = '✨ Uploading Details... 🙏';
  proceedBtn.disabled = true;

  try {
    const uid = generateUID();
    const slug = (state.gfName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'love') + '-' + uid;
    
    // 1. Prepare Form Data
    const formData = new FormData();
    for (let i = 0; i < state.photos.length; i++) {
        formData.append('photos', state.photos[i]);
    }
    
    const dbData = {
        uid: slug,
        userEmail: state.userEmail,
        gfName: state.gfName,
        bfName: state.bfName,
        message: state.message,
        specialDate: state.specialDate,
        theme: state.theme,
        music: state.music
    };
    formData.append('data', JSON.stringify(dbData));

    // 2. Post to custom Node.js backend
    const res = await fetch('http://127.0.0.1:8420/api/surprises', {
        method: 'POST',
        body: formData
    });
    
    if (!res.ok) {
        throw new Error('Failed to save to backend');
    }

    state.currentSlug = slug;
    proceedBtn.innerHTML = oldText;
    proceedBtn.disabled = false;
    
    // Data is safely stored, now open Payment Modal
    openModal('paymentModal');
    
  } catch (err) {
      console.error(err);
      alert('WARNING: Could not connect to Local Backend Server (port 8420)!\nMake sure you are running "node server.js" in the terminal.\nWe are falling back to local storage for now, but your email will NOT be saved in db.json!');
      
      // Fallback to local storage for completely local demo without server
      const uid = generateUID();
      const slug = 'love-' + uid;
      const dbData = { ...state, uid: slug, photos: state.photoPreviews };
      localStorage.setItem('lb_' + slug, JSON.stringify(dbData));
      
      state.currentSlug = slug;
      proceedBtn.innerHTML = oldText;
      proceedBtn.disabled = false;
      
      openModal('paymentModal');
  }
};

// ---------- Payment ----------
window.initiatePayment = async function() {
  const payBtn = document.getElementById('payBtn');
  payBtn.innerHTML = '<span>Redirecting to Instagram... 💌</span>';
  payBtn.disabled = true;

  // Redirect to Instagram DM
  const igUrl = 'https://ig.me/m/asis_irl'; 
  
  alert('Your surprise details have been successfully saved to our system!\n\nPlease just send us your payment screenshot on Instagram to receive your link.');
  
  closeModal();
  window.location.href = igUrl;
};

async function onPaymentSuccess() {
  // Not used anymore in the manual payment flow
}

window.previewSurprise = function() {
  const uid = document.getElementById('generatedLink').textContent.split('id=')[1];
  if (uid) window.open(`love/index.html?id=${uid}`, '_blank');
};

// ---------- Copy Link ----------
window.copyLink = function() {
  const link = document.getElementById('generatedLink').textContent;
  const btn = document.getElementById('copyBtn');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).then(() => {
      btn.textContent = 'Copied! ✓';
      btn.style.background = '#16a34a';
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.style.background = '';
      }, 2000);
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = link; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = 'Copied! ✓';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  }
};

window.shareWhatsApp = function(e) {
  e.preventDefault();
  const href = document.getElementById('waShareBtn').href;
  window.open(href, '_blank');
};

// ---------- Modals ----------
window.openModal = function(id) {
  document.getElementById(id).classList.add('open');
};
window.closeModal = function() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
};

// ---------- Helpers ----------
function generateUID() {
  return Math.random().toString(36).substr(2, 8);
}
