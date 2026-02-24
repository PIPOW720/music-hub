import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import { getDatabase, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const app = initializeApp({
  apiKey: "AIzaSyDpkeu4920YRA4pc5HOAaEuP7-KMevUNno",
  authDomain: "davi-vibes.firebaseapp.com",
  projectId: "davi-vibes",
  storageBucket: "davi-vibes.firebasestorage.app",
  messagingSenderId: "198203679502",
  appId: "1:198203679502:web:cfc71ee1dcd2a537412d5f",
  measurementId: "G-YHNRLPCH08",
  databaseURL: "https://davi-vibes-default-rtdb.firebaseio.com"
});

getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app);

// ── Gera código único ──────────────────────────────────────────
function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
} // ← chave que estava faltando

// ── Preview do avatar ──────────────────────────────────────────
window.previewAvatar = function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const preview = document.getElementById("avatarPreview");
  const icon = document.getElementById("avatarIcon");
  preview.src = URL.createObjectURL(file);
  preview.classList.remove("hidden");
  icon.classList.add("hidden");
};

// ── Toggle senha ───────────────────────────────────────────────
window.togglePass = function (inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  const hidden = input.type === "password";
  input.type = hidden ? "text" : "password";
  icon.textContent = hidden ? "visibility_off" : "visibility";
};

// ── Helpers de erro ────────────────────────────────────────────
function showError(msg) {
  const el = document.getElementById("register-error");
  el.textContent = msg;
  el.classList.remove("hidden");
} // ← chave que estava faltando

function hideError() {
  document.getElementById("register-error").classList.add("hidden");
} // ← chave que estava faltando

// ── Submissão ──────────────────────────────────────────────────
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;
  const avatarFile = document.getElementById("avatarInput").files[0];

  if (!username) return showError("Informe um nome de usuário.");
  if (!email) return showError("Informe seu e-mail.");
  if (password.length < 6) return showError("A senha deve ter no mínimo 6 caracteres.");
  if (password !== confirm) return showError("As senhas não coincidem.");
  if (!terms) return showError("Aceite os termos para continuar.");

  const btn = document.querySelector("#registerForm button[type='submit']");
  btn.disabled = true;
  btn.textContent = "Criando conta...";

  try {
    // 1. Cria usuário
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // 2. Upload da foto (se escolheu uma)
    let photoURL = "";
    if (avatarFile) {
      try {
        btn.textContent = "Enviando foto...";
        const sRef = storageRef(storage, `avatars/${user.uid}`);
        await uploadBytes(sRef, avatarFile);
        photoURL = await getDownloadURL(sRef);
      } catch (uploadErr) {
        console.warn("Foto não pôde ser salva:", uploadErr.message);
      }
    }

    // 3. Atualiza perfil no Auth
    await updateProfile(user, {
      displayName: username,
      ...(photoURL && { photoURL }),
    });

    // 4. Salva perfil no Realtime Database (necessário pro chat)
    const code = generateCode();
    const tag = `${username}#${code}`;
    await set(dbRef(db, `users/${user.uid}`), {
      uid: user.uid,
      displayName: username,
      email: user.email,
      photoURL: photoURL || "",
      tag: tag,
      code: code,
      createdAt: Date.now()
    });

    // 5. Redireciona
    window.location.href = "/index.html";

  } catch (err) {
    console.error("Erro no registro:", err);
    const msgs = {
      "auth/email-already-in-use": "Este e-mail já está cadastrado.",
      "auth/invalid-email": "E-mail inválido.",
      "auth/weak-password": "Senha muito fraca (mínimo 6 caracteres).",
      "auth/network-request-failed": "Sem conexão. Verifique sua internet.",
    };
    showError(msgs[err.code] || `Erro ao criar conta: ${err.message}`);
    btn.disabled = false;
    btn.textContent = "Criar Conta";
  }
});

// ── Fix autofill Chrome/Android ────────────────────────────────
document.querySelectorAll(".input-glass").forEach(input => {
  setInterval(() => {
    try {
      const bg = window.getComputedStyle(input).backgroundColor;
      if (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        input.style.setProperty("background", "transparent", "important");
        input.style.setProperty("color", "#ffffff", "important");
        input.style.setProperty("-webkit-text-fill-color", "#ffffff", "important");
      }
    } catch { }
  }, 500);
});
