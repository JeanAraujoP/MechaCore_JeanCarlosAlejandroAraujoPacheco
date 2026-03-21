// ─────────────────────────────────────────────
//  MechaCore – Pago  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form            = document.getElementById("registrationForm");
  const inputNumero     = document.getElementById("numeroFactura");
  const inputFecha      = document.getElementById("fechaPago");
  const inputTotal      = document.getElementById("total");
  const selectRef       = document.getElementById("documentType");
  const docTypeError    = document.getElementById("documentTypeError");
  const btnRegister     = document.querySelector(".btn-register");
  const btnText         = document.querySelector(".btn-text");
  const spinner         = document.querySelector(".spinner");
  const toast           = document.getElementById("toast");

  // ── Pre-rellenar desde localStorage ─────────
  try {
    const factura = JSON.parse(localStorage.getItem("mechacore_cabeza_factura") || "{}");
    if (factura.numeroFactura) inputNumero.value = factura.numeroFactura;
    if (factura.total)         inputTotal.value  = factura.total;
  } catch (_) {}

  // Pre-rellenar fecha con hoy en formato DD/MM/AAAA
  const hoy = new Date();
  const dd  = String(hoy.getDate()).padStart(2, "0");
  const mm  = String(hoy.getMonth() + 1).padStart(2, "0");
  const yyyy = hoy.getFullYear();
  inputFecha.value = `${dd}/${mm}/${yyyy}`;

  // ── Auto-formato fecha DD/MM/AAAA ────────────
  inputFecha.addEventListener("input", (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5);
    if (val.length > 10) val = val.slice(0, 10);
    e.target.value = val;
    clearError(inputFecha);
  });

  // ── Info por referencia de pago ──────────────
  const infoReferencias = {
    tc: { icon: "fa-credit-card", color: "#3498db", titulo: "Tarjeta de Crédito",
          detalle: "Cargo diferido. Aplican intereses según entidad bancaria." },
    td: { icon: "fa-credit-card", color: "#8e44ad", titulo: "Tarjeta de Débito",
          detalle: "Débito inmediato a tu cuenta corriente o de ahorros." },
    pp: { icon: "fa-globe",       color: "#f39c12", titulo: "Pasarela de Pago",
          detalle: "Proceso seguro mediante plataforma de pagos en línea." },
    bd: { icon: "fa-mobile-alt",  color: "#27ae60", titulo: "Billetera Digital",
          detalle: "Pago desde Nequi, Daviplata, Nu Bank u otra billetera." },
    tb: { icon: "fa-university",  color: "#2c3e50", titulo: "Transferencia Bancaria",
          detalle: "Transferencia interbancaria. Puede tardar 1–2 días hábiles." },
  };

  // Panel informativo de referencia
  const infoPanel = document.createElement("div");
  infoPanel.style.cssText =
    "display:none;align-items:center;gap:10px;padding:10px 14px;" +
    "border-radius:8px;margin-top:8px;font-size:.83rem;";
  selectRef.closest(".form-group").appendChild(infoPanel);

  selectRef.addEventListener("change", () => {
    const info = infoReferencias[selectRef.value];
    docTypeError.textContent     = "";
    selectRef.style.borderColor  = "";

    if (!info) { infoPanel.style.display = "none"; return; }

    infoPanel.style.display    = "flex";
    infoPanel.style.background = info.color + "15";
    infoPanel.style.borderLeft = `4px solid ${info.color}`;
    infoPanel.style.color      = info.color;
    infoPanel.innerHTML =
      `<i class="fas ${info.icon}" style="font-size:1.3rem"></i>` +
      `<div><strong>${info.titulo}</strong><br>` +
      `<span style="color:#555;font-size:.78rem">${info.detalle}</span></div>`;
  });

  // ── Resumen de pago ──────────────────────────
  const resumen = document.createElement("div");
  resumen.style.cssText =
    "background:#f8f9fa;border-radius:10px;padding:14px 16px;" +
    "margin-top:16px;font-size:.85rem;border:1px solid #e0e0e0";
  resumen.innerHTML = `
    <p style="font-weight:700;margin-bottom:8px;color:#2c3e50">
      <i class="fas fa-receipt"></i> Resumen de pago
    </p>
    <div id="resumenContenido" style="color:#555;line-height:1.8"></div>
  `;
  form.insertBefore(resumen, form.querySelector("button[type='submit']"));

  function actualizarResumen() {
    const numero = inputNumero.value.trim();
    const fecha  = inputFecha.value.trim();
    const total  = parseFloat(inputTotal.value);
    const ref    = infoReferencias[selectRef.value];

    const contenido = document.getElementById("resumenContenido");
    contenido.innerHTML = `
      <span>📄 Factura: <strong>${numero || "—"}</strong></span><br>
      <span>📅 Fecha: <strong>${fecha || "—"}</strong></span><br>
      <span>💰 Total: <strong>${!isNaN(total) ? formatCOP(total) : "—"}</strong></span><br>
      <span>💳 Referencia: <strong>${ref ? ref.titulo : "—"}</strong></span>
    `;
  }

  [inputNumero, inputFecha, inputTotal].forEach((el) =>
    el.addEventListener("input", actualizarResumen)
  );
  selectRef.addEventListener("change", actualizarResumen);
  actualizarResumen(); // Inicial

  // ── Formato moneda COP ───────────────────────
  function formatCOP(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);
  }

  // ── Validar fecha DD/MM/AAAA ─────────────────
  function isValidDate(str) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(str)) return false;
    const [, d, m, y] = str.match(regex).map(Number);
    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth()    === m - 1 &&
      date.getDate()     === d
    );
  }

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
    el.style.borderColor = msg ? "#e74c3c" : "";
  }

  function clearError(el) { setError(el, ""); }

  [inputNumero, inputTotal].forEach((el) =>
    el.addEventListener("input", () => clearError(el))
  );

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;

    // Número de factura
    if (!inputNumero.value.trim()) {
      setError(inputNumero, "El número de factura es obligatorio.");
      valid = false;
    }

    // Fecha de pago
    const fecha = inputFecha.value.trim();
    if (!fecha) {
      setError(inputFecha, "La fecha de pago es obligatoria.");
      valid = false;
    } else if (!isValidDate(fecha)) {
      setError(inputFecha, "Formato inválido. Use DD/MM/AAAA.");
      valid = false;
    }

    // Monto total
    const total = parseFloat(inputTotal.value);
    if (inputTotal.value === "" || isNaN(total)) {
      setError(inputTotal, "El monto total es obligatorio.");
      valid = false;
    } else if (total <= 0) {
      setError(inputTotal, "El monto debe ser mayor a 0.");
      valid = false;
    }

    // Referencia de pago
    if (!selectRef.value) {
      docTypeError.textContent  = "Selecciona una referencia de pago.";
      docTypeError.style.color  = "#e74c3c";
      docTypeError.style.fontSize = ".75rem";
      selectRef.style.borderColor = "#e74c3c";
      valid = false;
    }

    return valid;
  }

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

  // ── Guardar en localStorage ──────────────────
  function savePago() {
    const val  = selectRef.value;
    const data = {
      numeroFactura   : inputNumero.value.trim(),
      fechaPago       : inputFecha.value.trim(),
      total           : parseFloat(inputTotal.value),
      totalFormato    : formatCOP(parseFloat(inputTotal.value)),
      referenciaCodigo: val,
      referenciaLabel : infoReferencias[val]?.titulo ?? val,
      timestamp       : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_pago", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const data = savePago();
      console.log("Pago registrado:", data);

      showToast(`Pago de ${data.totalFormato} registrado correctamente.`);

      setTimeout(() => {
        window.location.href = "/ASSETS/Productos.html";
      }, 1500);
    }, 900);
  });

});