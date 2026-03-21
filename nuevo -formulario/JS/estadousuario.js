// ─────────────────────────────────────────────
//  MechaCore – Estado Usuario  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form              = document.getElementById("registerForm");
  const selectEstado      = document.getElementById("EstadoUsuario");
  const documentTypeError = document.getElementById("documentTypeError");
  const checkTerms        = document.getElementById("terms");
  const btnRegister       = document.querySelector(".btn-register");
  const btnText           = document.querySelector(".btn-text");

  // ── Descripción extendida por estado ────────
  const descripciones = {
    A  : { label: "Activo",       color: "#27ae60", icon: "fa-check-circle",
           detalle: "El usuario tiene acceso completo a la plataforma." },
    I  : { label: "Inactivo",     color: "#95a5a6", icon: "fa-moon",
           detalle: "El usuario no ha tenido actividad reciente." },
    S  : { label: "Suspendido",   color: "#e67e22", icon: "fa-pause-circle",
           detalle: "El acceso está suspendido temporalmente." },
    B  : { label: "Baneado",      color: "#e74c3c", icon: "fa-ban",
           detalle: "El usuario ha sido bloqueado de la plataforma." },
    ER : { label: "En revisión",  color: "#3498db", icon: "fa-search",
           detalle: "La cuenta está siendo revisada por el equipo." },
    E  : { label: "Eliminado",    color: "#7f8c8d", icon: "fa-trash",
           detalle: "El usuario ha sido eliminado del sistema." },
  };

  // ── Panel informativo (se inserta dinámicamente) ──
  let infoPanel = null;

  function mostrarInfo(valor) {
    if (!infoPanel) {
      infoPanel = document.createElement("div");
      infoPanel.style.cssText =
        "display:flex;align-items:center;gap:10px;padding:10px 14px;" +
        "border-radius:8px;margin-top:8px;font-size:.85rem;transition:all .3s";
      selectEstado.closest(".form-group").appendChild(infoPanel);
    }

    if (!valor || !descripciones[valor]) {
      infoPanel.style.display = "none";
      return;
    }

    const { label, color, icon, detalle } = descripciones[valor];
    infoPanel.style.display     = "flex";
    infoPanel.style.background  = color + "18";
    infoPanel.style.borderLeft  = `4px solid ${color}`;
    infoPanel.style.color       = color;
    infoPanel.innerHTML =
      `<i class="fas ${icon}"></i>` +
      `<div><strong>${label}</strong><br>` +
      `<span style="color:#555;font-size:.8rem">${detalle}</span></div>`;
  }

  selectEstado.addEventListener("change", () => {
    mostrarInfo(selectEstado.value);
    clearError(selectEstado);
    documentTypeError.textContent = "";
  });

  checkTerms.addEventListener("change", () => clearError(checkTerms));

  // ── Utilidades de error ──────────────────────
  function setError(el, msg) {
    const wrapper = el.closest(".form-group");
    if (!wrapper) return;
    let errorEl = wrapper.querySelector(".error-msg");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "error-msg";
      errorEl.style.cssText =
        "color:#e74c3c;font-size:.75rem;margin-top:4px;display:block";
      wrapper.appendChild(errorEl);
    }
    errorEl.textContent = msg;
    if (el.type !== "checkbox") el.style.borderColor = msg ? "#e74c3c" : "";
  }

  function clearError(el) { setError(el, ""); }

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;

    if (!selectEstado.value) {
      documentTypeError.textContent = "Selecciona un estado de usuario.";
      documentTypeError.style.color = "#e74c3c";
      documentTypeError.style.fontSize = ".75rem";
      selectEstado.style.borderColor = "#e74c3c";
      valid = false;
    }

    if (!checkTerms.checked) {
      setError(checkTerms, "Debes aceptar los términos y condiciones.");
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveEstadoUsuario() {
    const valor = selectEstado.value;
    const data = {
      estadoCodigo  : valor,
      estadoLabel   : descripciones[valor]?.label ?? valor,
      timestamp     : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_estado_usuario", JSON.stringify(data));
    return data;
  }

  // ── actualizarStock (llamado por onclick del botón) ──
  function actualizarStock() {
    if (!validateForm()) return;

    btnRegister.disabled  = true;
    btnText.style.opacity = "0.6";

    setTimeout(() => {
      const data = saveEstadoUsuario();
      console.log("Estado usuario guardado:", data);

      btnRegister.disabled  = false;
      btnText.style.opacity = "";

      window.location.href = "/ASSETS/FormularioUsuario.html";
    }, 600);
  }

  // Exponer globalmente (el HTML usa onclick="actualizarStock()")
  window.actualizarStock = actualizarStock;

  // ── Submit como fallback ─────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    actualizarStock();
  });

});