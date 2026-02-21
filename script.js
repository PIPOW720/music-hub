// script.js — Music Hub Dashboard

// ===== SUPABASE STORAGE =====
const STORAGE = 'https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe';

// ===== DADOS DAS MÚSICAS =====
const tracks = [
  {
    title: "MY EYES",
    artist: "Travis Scott",
    img: `${STORAGE}/images/album-travisscot.jpg`,
    src: `${STORAGE}/musicas/My Eyes.mp3`
  },
  {
    title: "Champagne Coast",
    artist: "Blood Orange",
    img: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/images/Champagnecoast.jpg`,
    src: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/musicas/Champagne%20Coast.mp3`
  },
  {
    title: "Iris",
    artist: "Goo Goo Dolls",
    img: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/images/TheGooGooDolls.jpg`,
    src: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/musicas/GooGooDolls-Iris.mp3`
  },
  {
    title: "O Vovô Não Ta Casado",
    artist: "O Vovô Não Ta Casado",
    img: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/images/OVovoNaoTaCasado.jpg`,
    src: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/musicas/AITODOMUNDO.mp3`
  },
  {
    title: "Sunsets",
    artist: "Dayglow",
    img: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/images/album-sunsets.jpg`,
    src: `${STORAGE}/musicas/sunsets.mp3`
  },
  {
    title: "Sidewalks and Skeletons",
    artist: "Sidewalks and Skeletons",
    img: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/images/sidewalks.jpg`,
    src: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/musicas/sidewalks.mp3`
  },
  {
    title: "PISOU NA MINHA CARA",
    artist: "DJ GBR",
    img: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/images/automotivo.jpg`,
    src: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/musicas/AUTOMOTIVO VEM PREPARADA - PISOU NA MINHA CARA.mp3`
  },
  {
    title: "Sunflower",
    artist: "Post Malone",
    img: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/images/sunflower.jpg`,
    src: `https://uovdxuxkuomqjmwjhcvj.supabase.co/storage/v1/object/public/davi-vibe/musicas/Sunflower.mp3`
  },
];

// ===== AUDIO =====
const audio = new Audio();
audio.volume = 0.66;

// ===== ELEMENTOS =====
const btnPlay = document.getElementById('btn-play');
const btnPlayIcon = btnPlay.querySelector('.material-symbols-outlined');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnShuffle = document.getElementById('btn-shuffle');
const btnRepeat = document.getElementById('btn-repeat');
const btnFavorite = document.getElementById('btn-favorite');
const btnVolume = document.getElementById('btn-volume');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressThumb = document.getElementById('progress-thumb');
const volumeBar = document.getElementById('volume-bar');
const volumeFill = document.getElementById('volume-fill');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');
const playerImg = document.getElementById('player-img');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');

// ===== ESTADO =====
let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
let isFavorite = false;
let isMuted = false;
let lastVolume = 0.66;

// ===== UTILITÁRIOS =====
function formatTime(s) {
  if (isNaN(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function setPlaying(playing) {
  btnPlayIcon.textContent = playing ? 'pause' : 'play_arrow';
}

function highlightCard(index) {
  document.querySelectorAll('.track-card').forEach(c => {
    c.style.opacity = '1';
  });
  const active = document.querySelector(`.track-card[data-index="${index}"]`);
  if (active) active.style.opacity = '1';
}

// ===== CARREGAR MÚSICA =====
function loadTrack(index, autoplay = false) {
  currentIndex = index;
  const track = tracks[index];

  audio.pause();
  audio.src = track.src;
  audio.load();

  playerImg.src = track.img;
  playerTitle.textContent = track.title;
  playerArtist.textContent = track.artist;

  progressFill.style.width = '0%';
  if (progressThumb) progressThumb.style.left = '0%';
  timeCurrent.textContent = '0:00';
  timeTotal.textContent = '0:00';

  setPlaying(false);
  highlightCard(index);

  if (autoplay) {
    audio.play()
      .then(() => setPlaying(true))
      .catch(err => console.warn('Erro ao tocar:', err));
  }
}

// ===== PLAY / PAUSE =====
btnPlay.addEventListener('click', () => {
  if (audio.paused) {
    audio.play()
      .then(() => setPlaying(true))
      .catch(err => console.warn('Erro ao tocar:', err));
  } else {
    audio.pause();
    setPlaying(false);
  }
});

// ===== PROGRESSO TEMPO REAL =====
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${pct}%`;
  if (progressThumb) progressThumb.style.left = `${pct}%`;
  timeCurrent.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audio.duration);
});

// ===== CLIQUE NA BARRA DE PROGRESSO =====
progressBar.addEventListener('click', (e) => {
  if (!audio.duration) return;
  const rect = progressBar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
});

// ===== FIM DA MÚSICA =====
audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play().then(() => setPlaying(true));
  } else if (isShuffle) {
    loadTrack(Math.floor(Math.random() * tracks.length), true);
  } else {
    goNext();
  }
});

// ===== PREV / NEXT =====
function goNext() {
  loadTrack((currentIndex + 1) % tracks.length, true);
}
function goPrev() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    loadTrack((currentIndex - 1 + tracks.length) % tracks.length, true);
  }
}
btnNext.addEventListener('click', goNext);
btnPrev.addEventListener('click', goPrev);

// ===== VOLUME =====
volumeBar.addEventListener('click', (e) => {
  const rect = volumeBar.getBoundingClientRect();
  const vol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.volume = vol;
  lastVolume = vol > 0 ? vol : lastVolume;
  isMuted = vol === 0;
  volumeFill.style.width = `${vol * 100}%`;
  btnVolume.textContent = vol === 0 ? 'volume_off' : vol < 0.4 ? 'volume_down' : 'volume_up';
});

btnVolume.addEventListener('click', () => {
  isMuted = !isMuted;
  audio.volume = isMuted ? 0 : lastVolume;
  volumeFill.style.width = isMuted ? '0%' : `${lastVolume * 100}%`;
  btnVolume.textContent = isMuted ? 'volume_off' : 'volume_up';
});

// ===== SHUFFLE =====
btnShuffle.addEventListener('click', () => {
  isShuffle = !isShuffle;
  btnShuffle.style.color = isShuffle ? '#ec1337' : '';
});

// ===== REPEAT =====
btnRepeat.addEventListener('click', () => {
  isRepeat = !isRepeat;
  audio.loop = false;
  btnRepeat.style.color = isRepeat ? '#ec1337' : '';
  btnRepeat.textContent = isRepeat ? 'repeat_one' : 'repeat';
});

// ===== FAVORITO =====
btnFavorite.addEventListener('click', () => {
  isFavorite = !isFavorite;
  btnFavorite.style.color = isFavorite ? '#ec1337' : '';
  btnFavorite.style.fontVariationSettings = isFavorite ? "'FILL' 1" : "'FILL' 0";
});

// ===== CARDS (HOME) =====
document.querySelectorAll('.track-card').forEach((card) => {
  card.addEventListener('click', () => {
    loadTrack(parseInt(card.dataset.index), true);
  });
});

// ===== MÚSICAS DAS PÁGINAS DE CATEGORIA =====
document.querySelectorAll('.track-row').forEach((row) => {
  row.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    loadTrack(parseInt(row.dataset.index), true);
  });
});

document.getElementById('btn-hero-play').addEventListener('click', () => {
  loadTrack(5, true);
});

// ===== INICIALIZAR =====
loadTrack(0);