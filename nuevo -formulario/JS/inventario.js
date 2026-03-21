// ─────────────────────────────────────────────
//  MechaCore – Inventario  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form               = document.getElementById("registerForm");
  const inputProducto      = document.getElementById("producto");
  const inputStockActual   = document.getElementById("stockActual");
  const inputStockMinimo   = document.getElementById("stockMinimo");
  const inputUbicacion     = document.getElementById("ubicacion");
  const inputFecha         = document.getElementById("ultimaActualizacion");
  const checkTerms         = document.getElementById("terms");
  const btnRegister        = document.querySelector(".btn-register");
  const btnText            = document.querySelector(".btn-text");

  // ── Fecha máxima = hoy ───────────────────────
  const today = new Date().toISOString().split("T")[0];
  inputFecha.setAttribute("max", today);
  inputFecha.value = today; // Pre-rellenar con hoy

  // ── Alerta de stock bajo ─────────────────────
  const stockAlert = document.createElement("div");
  stockAlert.style.cssText =
    "display:none;align-items:center;gap:8px;padding:10px 14px;" +
    "border-radius:8px;margin-top:8px;font-size:.83rem;";
  inputStockMinimo.closest(".form-group").insertAdjacentElement("afterend", stockAlert);

  function evaluarStock() {
    const actual  = parseInt(inputStockActual.value, 10);
    const minimo  = parseInt(inputStockMinimo.value, 10);

    if (isNaN(actual) || isNaN(minimo) || minimo < 0) {
      stockAlert.style.display = "none";
      return;
    }

    if (actual <= 0) {
      stockAlert.style.display     = "flex";
      stockAlert.style.background  = "#fde8e8";
      stockAlert.style.borderLeft  = "4px solid #e74c3c";
      stockAlert.style.color       = "#e74c3c";
      stockAlert.innerHTML =
        `<i class="fas fa-times-circle"></i>` +
        `<div><strong>Sin stock</strong><br>` +
        `<span style="font-size:.78rem;color:#555">El producto está agotado.</span></div>`;
    } else if (actual <= minimo) {
      stockAlert.style.display     = "flex";
      stockAlert.style.background  = "#fff3e0";
      stockAlert.style.borderLeft  = "4px solid #e67e22";
      stockAlert.style.color       = "#e67e22";
      stockAlert.innerHTML =
        `<i class="fas fa-exclamation-triangle"></i>` +
        `<div><strong>Stock bajo</strong><br>` +
        `<span style="font-size:.78rem;color:#555">` +
        `Quedan ${actual} unidades (mínimo: ${minimo}). Reponer pronto.</span></div>`;
    } else {
      stockAlert.style.display     = "flex";
      stockAlert.style.background  = "#e8f8f0";
      stockAlert.style.borderLeft  = "4px solid #27ae60";
      stockAlert.style.color       = "#27ae60";
      stockAlert.innerHTML =
        `<i class="fas fa-check-circle"></i>` +
        `<div><strong>Stock suficiente</strong><br>` +
        `<span style="font-size:.78rem;color:#555">` +
        `${actual} unidades disponibles (mínimo: ${minimo}).</span></div>`;
    }
  }

  inputStockActual.addEventListener("input",  () => { clearError(inputStockActual);  evaluarStock(); });
  inputStockMinimo.addEventListener("input",  () => { clearError(inputStockMinimo);  evaluarStock(); });

  // ── Limpiar errores al escribir ──────────────
  [inputProducto, inputUbicacion, inputFecha].forEach((el) =>
    el.addEventListener("input", () => clearError(el))
  );
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

    // Producto
    if (!inputProducto.value.trim()) {
      setError(inputProducto, "El nombre del producto es obligatorio.");
      valid = false;
    }

    // Stock actual
    const actual = parseInt(inputStockActual.value, 10);
    if (inputStockActual.value === "" || isNaN(actual)) {
      setError(inputStockActual, "El stock actual es obligatorio.");
      valid = false;
    } else if (actual < 0) {
      setError(inputStockActual, "El stock no puede ser negativo.");
      valid = false;
    }

    // Stock mínimo
    const minimo = parseInt(inputStockMinimo.value, 10);
    if (inputStockMinimo.value === "" || isNaN(minimo)) {
      setError(inputStockMinimo, "El stock mínimo es obligatorio.");
      valid = false;
    } else if (minimo < 0) {
      setError(inputStockMinimo, "El stock mínimo no puede ser negativo.");
      valid = false;
    }

    // Ubicación
    if (!inputUbicacion.value.trim()) {
      setError(inputUbicacion, "La ubicación es obligatoria.");
      valid = false;
    }

    // Fecha
    if (!inputFecha.value) {
      setError(inputFecha, "La fecha de actualización es obligatoria.");
      valid = false;
    } else if (inputFecha.value > today) {
      setError(inputFecha, "La fecha no puede ser futura.");
      valid = false;
    }

    // Términos
    if (!checkTerms.checked) {
      setError(checkTerms, "Debes aceptar los términos y condiciones.");
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveInventario() {
    const actual = parseInt(inputStockActual.value, 10);
    const minimo = parseInt(inputStockMinimo.value, 10);
    const data = {
      producto           : inputProducto.value.trim(),
      stockActual        : actual,
      stockMinimo        : minimo,
      estadoStock        : actual <= 0 ? "agotado" : actual <= minimo ? "bajo" : "suficiente",
      ubicacion          : inputUbicacion.value.trim(),
      ultimaActualizacion: inputFecha.value,
      timestamp          : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_inventario", JSON.stringify(data));
    return data;
  }

  // ── actualizarInventario (onclick del botón) ──
  function actualizarInventario() {
    if (!validateForm()) return;

    btnRegister.disabled  = true;
    btnText.style.opacity = "0.6";

    setTimeout(() => {
      const data = saveInventario();
      console.log("Inventario guardado:", data);

      // Advertencia en consola si stock bajo
      if (data.estadoStock === "bajo") {
        console.warn(`⚠️ Stock bajo: ${data.producto} — ${data.stockActual} uds.`);
      } else if (data.estadoStock === "agotado") {
        console.error(`🚨 Agotado: ${data.producto}`);
      }

      btnRegister.disabled  = false;
      btnText.style.opacity = "";

      window.location.href = "/ASSETS/MetodoPago.html";
    }, 600);
  }

  // Exponer globalmente (el HTML usa onclick="actualizarInventario()")
  window.actualizarInventario = actualizarInventario;

  // ── Submit como fallback ─────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    actualizarInventario();
  });

});