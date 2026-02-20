import { initializeApp }  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const app = initializeApp({
  apiKey:            "AIzaSyDpkeu4920YRA4pc5HOAaEuP7-KMevUNno",
  authDomain:        "davi-vibes.firebaseapp.com",
  projectId:         "davi-vibes",
  storageBucket:     "davi-vibes.firebasestorage.app",
  messagingSenderId: "198203679502",
  appId:             "1:198203679502:web:cfc71ee1dcd2a537412d5f",
  measurementId:     "G-YHNRLPCH08"
});
const auth = getAuth(app);

function showError(msg) {
  const el = document.getElementById("forgot-error");
  el.textContent = msg;
  el.classList.remove("hidden");
}

function showSuccess() {
  document.getElementById("initial-state").classList.add("hidden");
  const s = document.getElementById("success-state");
  s.classList.remove("hidden");
  s.classList.add("flex");
}

// ── Envio do e-mail ───────────────────────────────────────────
document.getElementById("forgot-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("forgot-email").value.trim();
  if (!email) return showError("Informe seu e-mail.");

  const btn = e.submitter;
  btn.disabled    = true;
  btn.textContent = "Enviando...";

  try {
    await sendPasswordResetEmail(auth, email);
    showSuccess();
  } catch (err) {
    const msgs = {
      "auth/user-not-found": "Nenhuma conta encontrada com este e-mail.",
      "auth/invalid-email":  "E-mail inválido.",
    };
    showError(msgs[err.code] || "Erro ao enviar. Tente novamente.");
    btn.disabled    = false;
    btn.textContent = "Enviar Link de Recuperação";
  }
});

// ── Reenviar ──────────────────────────────────────────────────
document.getElementById("btn-resend").addEventListener("click", async () => {
  const email = document.getElementById("forgot-email").value.trim();
  if (!email) { showSuccess(); window.location.reload(); return; }
  try {
    await sendPasswordResetEmail(auth, email);
    alert("E-mail reenviado!");
  } catch {
    alert("Erro ao reenviar. Tente novamente.");
  }
});