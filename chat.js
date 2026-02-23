// chat.js — Davi Vibe Chat

// ── Estado do chat ────────────────────────────────────────
let currentFriend = {
    name: 'Lucas Mendes',
    online: true,
    nowPlaying: 'After Hours'
};

// ── Selecionar amigo ──────────────────────────────────────
function selectFriend(el, name, nowPlaying, online) {
    // Remove active de todos
    document.querySelectorAll('.friend-item').forEach(item => {
        item.classList.remove('active');
        item.style.borderLeft = '';
    });

    // Ativa o clicado
    el.classList.add('active');

    currentFriend = { name, online, nowPlaying };

    // Atualiza header
    document.getElementById('chat-friend-name').textContent = name;

    const nowPlayingEl = document.getElementById('chat-now-playing');
    const statusDot = document.getElementById('chat-status-dot');

    if (online && nowPlaying) {
        nowPlayingEl.textContent = nowPlaying;
        nowPlayingEl.parentElement.innerHTML = `
      <span class="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
      Online · Ouvindo <span id="chat-now-playing" class="text-primary font-semibold ml-1">${nowPlaying}</span>
    `;
        statusDot.className = 'absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background-dark rounded-full';
    } else {
        statusDot.className = 'absolute bottom-0 right-0 w-3 h-3 bg-slate-600 border-2 border-background-dark rounded-full';
        nowPlayingEl?.parentElement && (nowPlayingEl.parentElement.innerHTML = `
      <span class="w-1.5 h-1.5 bg-slate-500 rounded-full inline-block"></span>
      <span class="text-slate-500">Offline</span>
    `);
    }

    // Atualiza painel direito
    document.getElementById('right-name').textContent = name;
}

// ── Toggle painel de compartilhar música ──────────────────
function toggleSharePanel() {
    const panel = document.getElementById('share-music-panel');
    panel.classList.toggle('hidden');
}

// ── Compartilhar faixa ────────────────────────────────────
function shareTrack(title, artist) {
    toggleSharePanel();

    const feed = document.getElementById('messages-feed');
    const now = getNow();

    const div = document.createElement('div');
    div.className = 'msg-row flex flex-col gap-1 items-end self-end max-w-[70%]';
    div.innerHTML = `
    <div class="msg-bubble-out bg-primary p-1 rounded-2xl rounded-br-sm overflow-hidden shadow-lg shadow-primary/15">
      <div class="flex gap-3 bg-black/20 p-3 rounded-xl items-center min-w-[200px]">
        <div class="relative group cursor-pointer flex-shrink-0">
          <div class="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-2xl" style="font-variation-settings:'FILL' 1">music_note</span>
          </div>
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
            <span class="material-symbols-outlined text-white text-2xl" style="font-variation-settings:'FILL' 1">play_circle</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-white truncate">${escapeHtml(title)}</p>
          <p class="text-xs text-white/70">${escapeHtml(artist)}</p>
          <div class="mt-1.5 h-1 bg-white/20 rounded-full overflow-hidden">
            <div class="h-full bg-white w-0 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-1.5 mr-1">
      <span class="text-[9px] text-slate-600">${now}</span>
      <span class="material-symbols-outlined text-primary" style="font-size:12px">done_all</span>
    </div>
  `;

    feed.appendChild(div);
    scrollToBottom();
}

// ── Enviar mensagem de texto ──────────────────────────────
function sendMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (!text) return;

    appendOutgoingMessage(text);
    input.value = '';
    input.style.height = 'auto';

    // Simula digitação do amigo após delay
    setTimeout(() => showTypingIndicator(), 800);
    setTimeout(() => {
        removeTypingIndicator();
        appendIncomingMessage(getAutoReply(text));
    }, 2400);
}

// ── Mensagem enviada (própria) ────────────────────────────
function appendOutgoingMessage(text) {
    const feed = document.getElementById('messages-feed');
    const now = getNow();

    const div = document.createElement('div');
    div.className = 'msg-row flex flex-col gap-1 items-end self-end max-w-[70%]';
    div.innerHTML = `
    <div class="msg-bubble-out bg-primary px-4 py-3 rounded-2xl rounded-br-sm text-white text-sm leading-relaxed shadow-lg shadow-primary/15">
      ${escapeHtml(text).replace(/\n/g, '<br>')}
    </div>
    <div class="flex items-center gap-1.5 mr-1">
      <span class="text-[9px] text-slate-600">${now}</span>
      <span class="material-symbols-outlined text-primary" style="font-size:12px">done_all</span>
    </div>
  `;

    feed.appendChild(div);
    scrollToBottom();
}

// ── Mensagem recebida ─────────────────────────────────────
function appendIncomingMessage(text) {
    const feed = document.getElementById('messages-feed');
    const now = getNow();

    const avatarSrc = document.getElementById('chat-friend-avatar')?.src || '';
    const div = document.createElement('div');
    div.className = 'msg-row flex gap-3 max-w-[70%]';
    div.innerHTML = `
    <img class="w-8 h-8 rounded-full object-cover flex-shrink-0 self-end" src="${avatarSrc}" alt=""/>
    <div class="flex flex-col gap-1">
      <div class="msg-bubble-in bg-neutral-dark border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm text-slate-200 text-sm leading-relaxed">
        ${escapeHtml(text)}
      </div>
      <span class="text-[9px] text-slate-600 ml-1">${now}</span>
    </div>
  `;

    feed.appendChild(div);
    scrollToBottom();
}

// ── Indicador de digitação ────────────────────────────────
function showTypingIndicator() {
    const feed = document.getElementById('messages-feed');
    const avatarSrc = document.getElementById('chat-friend-avatar')?.src || '';
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.className = 'msg-row flex gap-3 max-w-[70%]';
    div.innerHTML = `
    <img class="w-8 h-8 rounded-full object-cover flex-shrink-0 self-end" src="${avatarSrc}" alt=""/>
    <div class="msg-bubble-in bg-neutral-dark border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
      <div class="typing-indicator flex items-center gap-1 h-4">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
    feed.appendChild(div);
    scrollToBottom();
}

function removeTypingIndicator() {
    document.getElementById('typing-indicator')?.remove();
}

// ── Tecla Enter ───────────────────────────────────────────
function handleMsgKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// ── Auto-resize textarea ──────────────────────────────────
function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ── Scroll para o fim ─────────────────────────────────────
function scrollToBottom() {
    const feed = document.getElementById('messages-feed');
    requestAnimationFrame(() => {
        feed.scrollTop = feed.scrollHeight;
    });
}

// ── Hora atual formatada ──────────────────────────────────
function getNow() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ── Escape HTML ───────────────────────────────────────────
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ── Respostas automáticas de demo ─────────────────────────
const autoReplies = [
    'Cara, que faixa incrível! 🎵',
    'Haha isso mesmo! Minha playlist tá perfeita.',
    'Ouvindo aqui também, que vibe!',
    'Vou adicionar na minha biblioteca agora.',
    'Você tem um gosto musical muito bom 😂',
    'Bora ouvir junto mais tarde?',
    '🔥🔥🔥',
    'Esse beat é pesado demais!',
];

function getAutoReply(msg) {
    return autoReplies[Math.floor(Math.random() * autoReplies.length)];
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    scrollToBottom();

    // Fecha share panel ao clicar fora
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('share-music-panel');
        const btn = e.target.closest('[onclick="toggleSharePanel()"]');
        if (!panel.classList.contains('hidden') && !panel.contains(e.target) && !btn) {
            panel.classList.add('hidden');
        }
    });
});