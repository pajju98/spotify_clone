const API = 'http://localhost:5000/api';

// ── Auth helpers ─────────────────────────────────────────────
function getToken() { return localStorage.getItem('token'); }
function getUser()  { return JSON.parse(localStorage.getItem('user') || 'null'); }
function saveAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
}
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// ── Greeting ─────────────────────────────────────────────────
const h = new Date().getHours();
document.getElementById('greeting').textContent =
  h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

// ── Topbar scroll ─────────────────────────────────────────────
const mainEl  = document.getElementById('main');
const topbar  = document.getElementById('topbar');
mainEl.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', mainEl.scrollTop > 20);
});

// ── Filter chips ──────────────────────────────────────────────
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// ── Audio player ──────────────────────────────────────────────
const audio   = new Audio();
let playing   = false;
let songs     = [];
let current   = -1;

const playBtn  = document.getElementById('playBtn');
const player   = document.querySelector('.player');

function fmt(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function setPlayIcon(isPlaying) {
  playBtn.querySelector('img').src = isPlaying ? 'svgs/pause.svg' : 'svgs/play-large.svg';
  playBtn.querySelector('img').alt = isPlaying ? 'Pause' : 'Play';
}

function highlightCard(index) {
  document.querySelectorAll('.card').forEach((c, i) => {
    c.classList.remove('playing');
    const eq = c.querySelector('.eq-bars');
    if (eq) eq.remove();
    if (i === index) {
      c.classList.add('playing');
      // Add equalizer bars inside card thumb
      const thumb = c.querySelector('.card-thumb');
      if (thumb) {
        const bars = document.createElement('div');
        bars.className = 'eq-bars';
        bars.innerHTML = '<span></span><span></span><span></span><span></span>';
        thumb.appendChild(bars);
      }
    }
  });
}

function playSong(index) {
  const song = songs[index];
  if (!song || !song.audioUrl) return;
  current = index;

  audio.src = song.audioUrl;
  audio.play().catch(() => {});
  playing = true;
  setPlayIcon(true);
  player.classList.add('active');

  // Update now-playing bar
  document.querySelector('.np-title').textContent  = song.title;
  document.querySelector('.np-artist').textContent = song.artist;
  document.querySelector('.np-thumb').textContent  = '🎵';

  highlightCard(index);

  // Progress bar updates
  audio.ontimeupdate = () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    document.querySelector('.progress-fill').style.width = pct + '%';
    document.querySelector('.time').textContent     = fmt(audio.currentTime);
    document.querySelector('.time.end').textContent = fmt(audio.duration);
  };

  audio.onended = () => playSong((current + 1) % songs.length);
}

// Play/Pause
playBtn.addEventListener('click', () => {
  if (songs.length === 0) return;
  if (current === -1) { playSong(0); return; }
  if (playing) {
    audio.pause();
    playing = false;
    setPlayIcon(false);
    player.classList.remove('active');
  } else {
    audio.play().catch(() => {});
    playing = true;
    setPlayIcon(true);
    player.classList.add('active');
  }
});

// Prev / Next
document.querySelector('[title="Previous"]').addEventListener('click', () => {
  if (songs.length === 0) return;
  playSong((current - 1 + songs.length) % songs.length);
});
document.querySelector('[title="Next"]').addEventListener('click', () => {
  if (songs.length === 0) return;
  playSong((current + 1) % songs.length);
});

// Progress bar click to seek
document.querySelector('.progress-bar').addEventListener('click', (e) => {
  if (!audio.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

// Volume bar click
document.querySelector('.volume-bar').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  audio.volume = Math.min(1, Math.max(0, pct));
  document.querySelector('.volume-fill').style.width = (pct * 100) + '%';
});

// ── Heart toggle ──────────────────────────────────────────────
const heartBtn = document.getElementById('heartBtn');
heartBtn.addEventListener('click', () => {
  heartBtn.classList.toggle('liked');
  heartBtn.querySelector('img').src = heartBtn.classList.contains('liked')
    ? 'svgs/heart-filled.svg' : 'svgs/heart.svg';
});

// ── Fetch & render songs ──────────────────────────────────────
async function loadSongs() {
  // Show skeleton loaders first
  const row = document.querySelector('.section:nth-of-type(2) .cards-row');
  if (!row) return;
  row.innerHTML = Array(5).fill(0).map(() => `
    <div class="card skeleton">
      <div class="card-thumb c1" style="font-size:0"></div>
      <div class="card-name">Loading...</div>
      <div class="card-desc">Please wait</div>
    </div>
  `).join('');

  try {
    const res  = await fetch(`${API}/songs`);
    const json = await res.json();
    songs = json.data || [];
    renderSongs(songs);
  } catch (e) {
    row.innerHTML = `<p style="color:var(--muted);padding:16px;grid-column:1/-1">
      Could not connect to backend. Make sure <code>npm run dev</code> is running.
    </p>`;
  }
}

function renderSongs(list) {
  const row = document.querySelector('.section:nth-of-type(2) .cards-row');
  if (!row) return;
  row.innerHTML = list.map((s, i) => `
    <div class="card" data-index="${i}">
      <div class="card-thumb c${(i % 12) + 1}">
        ${s.albumImage
          ? `<img class="album-img" src="${s.albumImage}" alt="${s.title}" onerror="this.style.display='none'">`
          : '🎵'}
      </div>
      <div class="card-play"><img src="svgs/play.svg" alt="Play"></div>
      <div class="card-name">${s.title}</div>
      <div class="card-desc">${s.artist} · ${s.album || ''}</div>
    </div>
  `).join('');

  row.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => playSong(+card.dataset.index));
  });
}

// ── Login modal ───────────────────────────────────────────────
function showLoginModal() {
  const existing = document.getElementById('loginModal');
  if (existing) { existing.remove(); return; }

  const overlay = document.createElement('div');
  overlay.id = 'loginModal';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.75);
    display:flex;align-items:center;justify-content:center;z-index:999;
    backdrop-filter:blur(4px);
  `;

  overlay.innerHTML = `
    <div style="
      background:#181818;border-radius:12px;padding:36px 32px;width:340px;
      color:#fff;font-family:'Roboto',sans-serif;
      box-shadow:0 24px 64px rgba(0,0,0,0.8);border:1px solid #2a2a2a;
      animation:fadeUp 0.2s ease;
    ">
      <div style="text-align:center;margin-bottom:28px">
        <div style="font-size:32px;margin-bottom:8px">🎵</div>
        <h2 style="font-size:1.5rem;font-weight:900;letter-spacing:-0.5px">Log in to Spotify</h2>
      </div>
      <input id="loginEmail" type="email" placeholder="Email address"
        style="width:100%;padding:12px 16px;margin-bottom:10px;border-radius:6px;
        border:1px solid #3a3a3a;background:#282828;color:#fff;font-size:14px;
        font-family:inherit;outline:none;transition:border-color 0.2s;box-sizing:border-box">
      <input id="loginPass" type="password" placeholder="Password"
        style="width:100%;padding:12px 16px;margin-bottom:16px;border-radius:6px;
        border:1px solid #3a3a3a;background:#282828;color:#fff;font-size:14px;
        font-family:inherit;outline:none;transition:border-color 0.2s;box-sizing:border-box">
      <div id="loginErr" style="color:#f15e6c;margin-bottom:12px;font-size:13px;min-height:18px"></div>
      <button id="loginSubmit" style="
        width:100%;padding:14px;background:#1db954;border:none;border-radius:30px;
        font-weight:900;font-size:15px;cursor:pointer;color:#000;font-family:inherit;
        transition:background 0.2s,transform 0.1s;letter-spacing:0.5px;
      ">Log In</button>
      <button id="loginClose" style="
        width:100%;padding:12px;background:transparent;border:1px solid #555;
        border-radius:30px;font-size:14px;cursor:pointer;color:#fff;
        margin-top:10px;font-family:inherit;transition:border-color 0.2s;
      ">Cancel</button>
    </div>
    <style>
      @keyframes fadeUp {
        from { opacity:0; transform:translateY(20px); }
        to   { opacity:1; transform:translateY(0); }
      }
      #loginEmail:focus, #loginPass:focus { border-color: #1db954 !important; }
      #loginSubmit:hover { background:#18a449 !important; }
      #loginClose:hover  { border-color:#999 !important; }
    </style>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.getElementById('loginClose').onclick = () => overlay.remove();

  document.getElementById('loginSubmit').onclick = async () => {
    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value;
    const err      = document.getElementById('loginErr');
    const btn      = document.getElementById('loginSubmit');
    err.textContent = '';
    if (!email || !password) { err.textContent = 'Fill in all fields.'; return; }
    btn.textContent = 'Logging in...';
    btn.disabled = true;
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!json.success) {
        err.textContent = json.message || 'Login failed';
        btn.textContent = 'Log In';
        btn.disabled = false;
        return;
      }
      saveAuth(json.data);
      overlay.remove();
      updateTopbar();
    } catch {
      err.textContent = 'Connection error — is the backend running?';
      btn.textContent = 'Log In';
      btn.disabled = false;
    }
  };

  // Enter key submits
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('loginSubmit').click();
  });
}

// ── Topbar auth state ─────────────────────────────────────────
function updateTopbar() {
  const user      = getUser();
  const signupBtn = document.querySelector('.topbar-pill:not(.primary)');
  const loginBtn  = document.querySelector('.topbar-pill.primary');
  const avatar    = document.querySelector('.avatar');

  if (user) {
    signupBtn.style.display = 'none';
    loginBtn.style.display  = 'none';
    avatar.style.display    = 'flex';
    avatar.textContent      = user.name[0].toUpperCase();
    avatar.title            = `${user.name} (click to log out)`;
    avatar.onclick          = () => { clearAuth(); updateTopbar(); };
  } else {
    signupBtn.style.display = '';
    loginBtn.style.display  = '';
    avatar.style.display    = 'none';
  }
}

document.querySelector('.topbar-pill.primary').addEventListener('click', showLoginModal);

// ── Init ──────────────────────────────────────────────────────
loadSongs();
updateTopbar();
