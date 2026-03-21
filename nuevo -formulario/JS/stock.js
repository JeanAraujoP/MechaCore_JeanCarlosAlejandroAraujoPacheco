// ─────────────────────────────────────────────
//  MechaCore – Stock  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form            = document.getElementById("registerForm");
  const inputMinimo     = document.getElementById("stockMinimo");
  const inputMaximo     = document.getElementById("stockMaximo");
  const inputFecha      = document.getElementById("fecha");
  const checkTerms      = document.getElementById("terms");
  const btnRegister     = document.querySelector(".btn-register");
  const btnText         = document.querySelector(".btn-text");

  // ── Fecha automática (readonly) ──────────────
  function actualizarFecha() {
    const ahora = new Date();
    inputFecha.value = ahora.toLocaleString("es-CO", {
      weekday: "long", year: "numeric", month: "long",
      day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  actualizarFecha();
  // Actualizar cada minuto
  setInterval(actualizarFecha, 60000);

  // ── Panel de rango visual ────────────────────
  const rangoPanel = document.createElement("div");
  rangoPanel.style.cssText =
    "display:none;padding:12px 14px;border-radius:8px;" +
    "margin-top:8px;font-size:.83rem;";
  inputMaximo.closest(".form-group").insertAdjacentElement("afterend", rangoPanel);

  function evaluarRango() {
    const min = parseInt(inputMinimo.value, 10);
    const max = parseInt(inputMaximo.value, 10);

    if (isNaN(min) || isNaN(max)) {
      rangoPanel.style.display = "none";
      return;
    }

    if (max <= min) {
      rangoPanel.style.display    = "flex";
      rangoPanel.style.alignItems = "center";
      rangoPanel.style.gap        = "8px";
      rangoPanel.style.background = "#fde8e8";
      rangoPanel.style.borderLeft = "4px solid #e74c3c";
      rangoPanel.style.color      = "#e74c3c";
      rangoPanel.innerHTML =
        `<i class="fas fa-exclamation-circle"></i>` +
        `<div><strong>Rango inválido</strong><br>` +
        `<span style="color:#555;font-size:.78rem">El stock máximo debe ser mayor al mínimo.</span></div>`;
      return;
    }

    const capacidad  = max - min;
    const umbralBajo = min + Math.round(capacidad * 0.25);
    const umbralMed  = min + Math.round(capacidad * 0.60);

    // Barra visual del rango
    rangoPanel.style.display    = "block";
    rangoPanel.style.background = "#f8f9fa";
    rangoPanel.style.borderLeft = "4px solid #27ae60";
    rangoPanel.style.color      = "#2c3e50";
    rangoPanel.innerHTML = `
      <p style="font-weight:700;margin-bottom:8px;color:#2c3e50">
        <i class="fas fa-chart-bar" style="color:#27ae60"></i> Rango de stock configurado
      </p>
      <div style="display:flex;justify-content:space-between;font-size:.75rem;color:#888;margin-bottom:4px">
        <span>Mínimo: <strong style="color:#e74c3c">${min}</strong></span>
        <span>Capacidad: <strong style="color:#3498db">${capacidad} uds.</strong></span>
        <span>Máximo: <strong style="color:#27ae60">${max}</strong></span>
      </div>
      <!-- Barra de zonas -->
      <div style="display:flex;height:10px;border-radius:6px;overflow:hidden;margin-bottom:8px">
        <div style="width:25%;background:#e74c3c" title="Zona crítica"></div>
        <div style="width:35%;background:#e67e22" title="Zona media"></div>
        <div style="width:40%;background:#27ae60" title="Zona óptima"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:.72rem;color:#888;margin-bottom:10px">
        <span style="color:#e74c3c">🔴 Crítico (&lt; ${umbralBajo})</span>
        <span style="color:#e67e22">🟠 Medio (${umbralBajo}–${umbralMed})</span>
        <span style="color:#27ae60">🟢 Óptimo (&gt; ${umbralMed})</span>
      </div>
      <p style="font-size:.75rem;color:#888;margin:0">
        <i class="fas fa-info-circle"></i>
        Se generará alerta cuando el stock caiga por debajo de <strong>${umbralBajo}</strong> unidades.
      </p>
    `;
  }

  inputMinimo.addEventListener("input", () => { clearError(inputMinimo); evaluarRango(); });
  inputMaximo.addEventListener("input", () => { clearError(inputMaximo); evaluarRango(); });
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

    const min = parseInt(inputMinimo.value, 10);
    const max = parseInt(inputMaximo.value, 10);

    if (inputMinimo.value === "" || isNaN(min)) {
      setError(inputMinimo, "El stock mínimo es obligatorio.");
      valid = false;
    } else if (min < 0) {
      setError(inputMinimo, "El stock mínimo no puede ser negativo.");
      valid = false;
    }

    if (inputMaximo.value === "" || isNaN(max)) {
      setError(inputMaximo, "El stock máximo es obligatorio.");
      valid = false;
    } else if (max < 0) {
      setError(inputMaximo, "El stock máximo no puede ser negativo.");
      valid = false;
    } else if (!isNaN(min) && max <= min) {
      setError(inputMaximo, "El stock máximo debe ser mayor al stock mínimo.");
      valid = false;
    }

    if (!checkTerms.checked) {
      setError(checkTerms, "Debes aceptar los términos y condiciones.");
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveStock() {
    const min       = parseInt(inputMinimo.value, 10);
    const max       = parseInt(inputMaximo.value, 10);
    const capacidad = max - min;

    // Leer stock actual del inventario si existe
    const inventario = JSON.parse(localStorage.getItem("mechacore_inventario") || "{}");
    const actual     = inventario.stockActual ?? null;

    let estadoActual = null;
    if (actual !== null) {
      const umbralBajo = min + Math.round(capacidad * 0.25);
      estadoActual = actual < umbralBajo ? "critico" : actual < min + Math.round(capacidad * 0.60) ? "medio" : "optimo";
    }

    const data = {
      stockMinimo     : min,
      stockMaximo     : max,
      capacidad       : capacidad,
      umbralCritico   : min + Math.round(capacidad * 0.25),
      umbralMedio     : min + Math.round(capacidad * 0.60),
      estadoActual    : estadoActual,
      fechaActualizacion: inputFecha.value,
      timestamp       : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_stock", JSON.stringify(data));
    return data;
  }

  // ── actualizarStock (onclick del botón) ──────
  function actualizarStock() {
    if (!validateForm()) return;

    btnRegister.disabled  = true;
    btnText.style.opacity = "0.6";

    setTimeout(() => {
      const data = saveStock();
      console.log("Stock guardado:", data);

      if (data.estadoActual === "critico") {
        console.warn(`⚠️ Stock en zona crítica. Mínimo: ${data.stockMinimo}, Umbral: ${data.umbralCritico}`);
      }

      btnRegister.disabled  = false;
      btnText.style.opacity = "";

      window.location.href = "/ASSETS/TipoDocumento.html";
    }, 600);
  }

  // Exponer globalmente (el HTML usa onclick="actualizarStock()")
  window.actualizarStock = actualizarStock;

  // ── Submit como fallback ─────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    actualizarStock();
  });

  // ── Pre-cargar stock mínimo desde inventario ─
  try {
    const inventario = JSON.parse(localStorage.getItem("mechacore_inventario") || "{}");
    if (inventario.stockMinimo && !inputMinimo.value) {
      inputMinimo.value = inventario.stockMinimo;
      evaluarRango();
    }
  } catch (_) {}

});