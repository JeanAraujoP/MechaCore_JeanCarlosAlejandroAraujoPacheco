// ─────────────────────────────────────────────
//  MechaCore – Ciudades  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form             = document.getElementById("registerForm");
  const selectCiudad     = document.getElementById("ciudad");
  const inputCodigo      = document.getElementById("codigoCiudad");
  const resultadoCiudad  = document.getElementById("resultadoCiudad");
  const checkTerms       = document.getElementById("terms");
  const btnRegister      = document.querySelector(".btn-register");
  const btnText          = document.querySelector(".btn-text");

  // ── Códigos y datos por ciudad ───────────────
  const datosCiudades = {
    "Bogotá"       : { codigo: "BOG-001", depto: "Cundinamarca", zona: "Centro" },
    "Medellín"     : { codigo: "MED-002", depto: "Antioquia",    zona: "Andina" },
    "Cali"         : { codigo: "CAL-003", depto: "Valle del Cauca", zona: "Pacífico" },
    "Barranquilla" : { codigo: "BAQ-004", depto: "Atlántico",    zona: "Caribe" },
    "Cartagena"    : { codigo: "CTG-005", depto: "Bolívar",      zona: "Caribe" },
  };

  // ── Al cambiar ciudad ────────────────────────
  selectCiudad.addEventListener("change", () => {
    const ciudad = selectCiudad.value;
    clearError(selectCiudad);

    if (!ciudad || !datosCiudades[ciudad]) {
      inputCodigo.value        = "";
      resultadoCiudad.innerHTML = "";
      resultadoCiudad.className = "";
      return;
    }

    const { codigo, depto, zona } = datosCiudades[ciudad];

    // Código automático
    inputCodigo.value = codigo;

    // Resultado informativo
    resultadoCiudad.innerHTML = `
      <i class="fas fa-map-marker-alt"></i>
      <strong>${ciudad}</strong> — ${depto} · Zona ${zona}
    `;
    resultadoCiudad.style.cssText =
      "color:#27ae60;font-size:.85rem;margin-top:6px;display:flex;gap:6px;align-items:center";
  });

  // ── Utilidades de error ──────────────────────
  function setError(el, msg) {
    const wrapper = el.closest(".fg") || el.closest(".form-group");
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
    if (el.tagName !== "INPUT" || el.type !== "checkbox") {
      el.style.borderColor = msg ? "#e74c3c" : "";
    }
  }

  function clearError(el) { setError(el, ""); }

  checkTerms.addEventListener("change", () => clearError(checkTerms));

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;

    if (!selectCiudad.value) {
      setError(selectCiudad, "Selecciona una ciudad.");
      valid = false;
    }

    if (!checkTerms.checked) {
      setError(checkTerms, "Debes aceptar los términos y condiciones.");
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveCiudad() {
    const ciudad = selectCiudad.value;
    const data = {
      ciudad    : ciudad,
      codigo    : inputCodigo.value,
      ...datosCiudades[ciudad],
      timestamp : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_ciudad", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    btnRegister.disabled  = true;
    btnText.style.opacity = "0.6";

    setTimeout(() => {
      const data = saveCiudad();
      console.log("Ciudad guardada:", data);

      btnRegister.disabled  = false;
      btnText.style.opacity = "";

      window.location.href = "/ASSETS/DetalleFactura.html";
    }, 600);
  });

});