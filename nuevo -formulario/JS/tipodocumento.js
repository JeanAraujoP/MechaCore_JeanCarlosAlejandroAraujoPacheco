// ─────────────────────────────────────────────
//  MechaCore – Tipo Documento  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const selectDoc     = document.getElementById("documentType");
  const docTypeError  = document.getElementById("documentTypeError");
  const checkTerms    = document.getElementById("terms");
  const termsError    = document.getElementById("termsError");
  const btnRegister   = document.querySelector(".btn-register");
  const btnText       = document.querySelector(".btn-text");
  const spinner       = document.querySelector(".spinner");
  const toast         = document.getElementById("toast");

  // El HTML tiene el <form> sin id, se toma por querySelector
  const form = document.querySelector("form") ?? document.getElementById("registerForm");

  // ── Info por tipo de documento ───────────────
  const infoDocumentos = {
    cedula: {
      label   : "Cédula de Ciudadanía",
      color   : "#27ae60",
      icon    : "fa-id-card",
      para    : "Ciudadanos colombianos mayores de 18 años.",
      formato : "6–10 dígitos numéricos.",
      entidad : "Registraduría Nacional del Estado Civil.",
    },
    ti: {
      label   : "Tarjeta de Identidad",
      color   : "#3498db",
      icon    : "fa-id-card",
      para    : "Menores de edad colombianos (7–17 años).",
      formato : "10–11 dígitos numéricos.",
      entidad : "Registraduría Nacional del Estado Civil.",
    },
    ppt: {
      label   : "Permiso por Protección Temporal",
      color   : "#e67e22",
      icon    : "fa-passport",
      para    : "Nacionales venezolanos en Colombia.",
      formato : "Alfanumérico, hasta 15 caracteres.",
      entidad : "Migración Colombia.",
    },
    ce: {
      label   : "Cédula de Extranjería",
      color   : "#9b59b6",
      icon    : "fa-globe",
      para    : "Extranjeros con residencia en Colombia.",
      formato : "6–12 caracteres alfanuméricos.",
      entidad : "Migración Colombia.",
    },
    pep: {
      label   : "Permiso Especial de Permanencia",
      color   : "#1abc9c",
      icon    : "fa-file-alt",
      para    : "Venezolanos con permanencia especial.",
      formato : "Alfanumérico, hasta 15 caracteres.",
      entidad : "Migración Colombia.",
    },
    nit: {
      label   : "NIT",
      color   : "#e74c3c",
      icon    : "fa-building",
      para    : "Personas jurídicas y empresas en Colombia.",
      formato : "9–10 dígitos + dígito de verificación.",
      entidad : "DIAN — Dirección de Impuestos y Aduanas Nacionales.",
    },
  };

  // ── Panel informativo ────────────────────────
  const infoPanel = document.createElement("div");
  infoPanel.style.cssText =
    "display:none;padding:12px 14px;border-radius:8px;" +
    "margin-top:8px;font-size:.83rem;";
  selectDoc.closest(".form-group").appendChild(infoPanel);

  // Hint de formato debajo del select
  const formatHint = document.createElement("span");
  formatHint.style.cssText =
    "font-size:.72rem;color:#888;margin-top:3px;display:block";
  selectDoc.closest(".form-group").appendChild(formatHint);

  selectDoc.addEventListener("change", () => {
    const info = infoDocumentos[selectDoc.value];
    docTypeError.textContent     = "";
    selectDoc.style.borderColor  = "";

    if (!info) {
      infoPanel.style.display = "none";
      formatHint.textContent  = "";
      return;
    }

    // Hint rápido
    formatHint.innerHTML =
      `<i class="fas fa-info-circle"></i> Formato: ${info.formato}`;

    // Panel detallado
    infoPanel.style.display    = "block";
    infoPanel.style.background = info.color + "12";
    infoPanel.style.borderLeft = `4px solid ${info.color}`;

    infoPanel.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <i class="fas ${info.icon}" style="color:${info.color};font-size:1.2rem"></i>
        <strong style="color:${info.color};font-size:.9rem">${info.label}</strong>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:.78rem;color:#555">
        <tr>
          <td style="padding:3px 0;font-weight:600;width:90px;color:#333">Para:</td>
          <td>${info.para}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;font-weight:600;color:#333">Formato:</td>
          <td>${info.formato}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;font-weight:600;color:#333">Entidad:</td>
          <td>${info.entidad}</td>
        </tr>
      </table>
    `;
  });

  // ── Pre-seleccionar si ya existe en localStorage ──
  try {
    const usuario = JSON.parse(localStorage.getItem("mechacore_usuario") || "{}");
    if (usuario.tipoDocumento && !selectDoc.value) {
      selectDoc.value = usuario.tipoDocumento;
      selectDoc.dispatchEvent(new Event("change"));
    }
  } catch (_) {}

  // ── Limpiar errores ──────────────────────────
  checkTerms.addEventListener("change", () => {
    termsError.textContent = "";
  });

  // ── Spinner ──────────────────────────────────
  function setLoading(active) {
    if (active) {
      btnText.style.display = "none";
      spinner.classList.remove("hidden");
      btnRegister.disabled  = true;
    } else {
      btnText.style.display = "";
      spinner.classList.add("hidden");
      btnRegister.disabled  = false;
    }
  }

  // ── Toast ────────────────────────────────────
  function showToast(msg) {
    toast.innerHTML = `<i class="fas fa-check-circle toast-icon"></i> ${msg}`;
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 400);
    }, 3000);
  }

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;

    if (!selectDoc.value) {
      docTypeError.textContent    = "Selecciona un tipo de documento.";
      docTypeError.style.color    = "#e74c3c";
      docTypeError.style.fontSize = ".75rem";
      selectDoc.style.borderColor = "#e74c3c";
      valid = false;
    }

    if (!checkTerms.checked) {
      termsError.textContent    = "Debes aceptar los términos y condiciones.";
      termsError.style.color    = "#e74c3c";
      termsError.style.fontSize = ".75rem";
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveTipoDocumento() {
    const val  = selectDoc.value;
    const info = infoDocumentos[val];
    const data = {
      tipoDocumento      : val,
      tipoDocumentoLabel : info?.label   ?? val,
      entidadEmisora     : info?.entidad ?? "",
      formatoEsperado    : info?.formato ?? "",
      timestamp          : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_tipo_documento", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const data = saveTipoDocumento();
      console.log("Tipo de documento guardado:", data);

      showToast(`Documento: ${data.tipoDocumentoLabel}`);

      setTimeout(() => {
        window.location.href = "../frontend4/MetodoPago.html";
      }, 1500);
    }, 900);
  });

});