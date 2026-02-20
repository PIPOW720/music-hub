import { initializeApp }   from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics }    from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile }
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL }
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

// ── Firebase ──────────────────────────────────────────────────
const app = initializeApp({
  apiKey:            "AIzaSyDpkeu4920YRA4pc5HOAaEuP7-KMevUNno",
  authDomain:        "davi-vibes.firebaseapp.com",
  projectId:         "davi-vibes",
  storageBucket:     "davi-vibes.firebasestorage.app",
  messagingSenderId: "198203679502",
  appId:             "1:198203679502:web:cfc71ee1dcd2a537412d5f",
  measurementId:     "G-YHNRLPCH08"
});
getAnalytics(app);
const auth    = getAuth(app);
const storage = getStorage(app);

// ── Avatar preview (local, instantâneo) ──────────────────────
window.previewAvatar = function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const preview = document.getElementById("avatarPreview");
  const icon    = document.getElementById("avatarIcon");
  const url     = URL.createObjectURL(file);
  preview.src   = url;
  preview.classList.remove("hidden");
  icon.classList.add("hidden");
};

// ── Toggle senha ──────────────────────────────────────────────
window.togglePass = function (inputId, iconId) {
  const input  = document.getElementById(inputId);
  const icon   = document.getElementById(iconId);
  const hidden = input.type === "password";
  input.type       = hidden ? "text" : "password";
  icon.textContent = hidden ? "visibility_off" : "visibility";
};

// ── Helpers ───────────────────────────────────────────────────
function showError(msg) {
  const el = document.getElementById("register-error");
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hideError() {
  document.getElementById("register-error").classList.add("hidden");
}

// ── Submissão do formulário ───────────────────────────────────
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const username  = document.getElementById("username").value.trim();
  const email     = document.getElementById("email").value.trim();
  const password  = document.getElementById("password").value;
  const confirm   = document.getElementById("confirmPassword").value;
  const terms     = document.getElementById("terms").checked;
  const avatarFile = document.getElementById("avatarInput").files[0];

  // Validações
  if (!username)               return showError("Informe um nome de usuário.");
  if (!email)                  return showError("Informe seu e-mail.");
  if (password.length < 6)    return showError("A senha deve ter no mínimo 6 caracteres.");
  if (password !== confirm)    return showError("As senhas não coincidem.");
  if (!terms)                  return showError("Aceite os termos para continuar.");

  const btn = e.submitter;
  btn.disabled    = true;
  btn.textContent = "Criando conta...";

  try {
    // 1. Cria usuário
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // 2. Upload da foto (se houver)
    let photoURL = "";
    if (avatarFile) {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, avatarFile);
      photoURL = await getDownloadURL(storageRef);
    }

    // 3. Atualiza perfil com nome e foto
    await updateProfile(user, {
      displayName: username,
      ...(photoURL && { photoURL }),
    });

    // 4. Redireciona
    window.location.href = "/index.html"; // ajuste para sua rota
  } catch (err) {
    const msgs = {
      "auth/email-already-in-use": "Este e-mail já está cadastrado.",
      "auth/invalid-email":        "E-mail inválido.",
      "auth/weak-password":        "Senha muito fraca.",
    };
    showError(msgs[err.code] || "Erro ao criar conta. Tente novamente.");
    btn.disabled    = false;
    btn.textContent = "Create My Account";
  }
});

// ── Fix autofill background ───────────────────────────────────
document.querySelectorAll(".input-glass").forEach(input => {
  setInterval(() => {
    try {
      if (window.getComputedStyle(input).backgroundColor !== "rgba(0, 0, 0, 0)") {
        input.style.setProperty("background", "transparent", "important");
        input.style.setProperty("color", "#ffffff", "important");
        input.style.setProperty("-webkit-text-fill-color", "#ffffff", "important");
      }
    } catch {}
  }, 500);
});