// ─────────────────────────────────────────────
//  MechaCore – Detalle Pedido  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form          = document.getElementById("registerForm");
  const inputCantidad = document.getElementById("cantidad");
  const inputSubtotal = document.getElementById("subtotal");
  const inputIva      = document.getElementById("iva");
  const inputTotal    = document.getElementById("total");
  const checkTerms    = document.getElementById("terms");
  const btnRegister   = document.querySelector(".btn-register");
  const btnText       = document.querySelector(".btn-text");

  const IVA_RATE = 0.19;

  // ── Leer precio unitario desde localStorage ──
  let precioUnitario = 0;
  let productoNombre = "Producto";

  const categoriaData = localStorage.getItem("mechacore_categoria");
  const facturaData   = localStorage.getItem("mechacore_detalle_factura");

  // Intentar obtener precio desde detalle_factura primero, luego categoria
  if (facturaData) {
    try {
      const parsed = JSON.parse(facturaData);
      precioUnitario = parsed.precioUnitario ?? 0;
      productoNombre = parsed.producto      ?? "Producto";
    } catch (_) {}
  } else if (categoriaData) {
    try {
      const parsed = JSON.parse(categoriaData);
      productoNombre = parsed.producto ?? "Producto";
    } catch (_) {}
  }

  // ── Mostrar referencia del producto ─────────
  const refEl = document.createElement("p");
  refEl.style.cssText =
    "font-size:.8rem;color:#888;margin-bottom:12px;margin-top:-4px";
  refEl.innerHTML =
    `<i class="fas fa-tag"></i> <strong>${productoNombre}</strong>` +
    (precioUnitario
      ? ` — Precio unitario: <strong>${formatCOP(precioUnitario)}</strong>`
      : "");
  inputCantidad.closest(".form-group").insertAdjacentElement("afterend", refEl);

  // ── Formato moneda COP ───────────────────────
  function formatCOP(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);
  }

  // ── Calcular subtotal → IVA → total ──────────
  function calcularTotal() {
    const cantidad = parseInt(inputCantidad.value, 10);

    if (!cantidad || cantidad <= 0 || isNaN(cantidad)) {
      inputSubtotal.value = "";
      inputIva.value      = "";
      inputTotal.value    = "";
      return;
    }

    const subtotal = cantidad * precioUnitario;
    const iva      = subtotal * IVA_RATE;
    const total    = subtotal + iva;

    inputSubtotal.value = formatCOP(subtotal);
    inputIva.value      = formatCOP(iva);
    inputTotal.value    = formatCOP(total);

    clearError(inputCantidad);
  }

  // Exponer globalmente (el HTML usa oninput="calcularTotal()")
  window.calcularTotal = calcularTotal;

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

  checkTerms.addEventListener("change", () => clearError(checkTerms));

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;
    const cantidad = parseInt(inputCantidad.value, 10);

    if (!inputCantidad.value || isNaN(cantidad)) {
      setError(inputCantidad, "La cantidad es obligatoria.");
      valid = false;
    } else if (cantidad <= 0) {
      setError(inputCantidad, "La cantidad debe ser mayor a 0.");
      valid = false;
    }

    if (!checkTerms.checked) {
      setError(checkTerms, "Debes aceptar los términos y condiciones.");
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveDetallePedido() {
    const cantidad = parseInt(inputCantidad.value, 10);
    const subtotal = cantidad * precioUnitario;
    const iva      = subtotal * IVA_RATE;
    const total    = subtotal + iva;

    const data = {
      producto        : productoNombre,
      precioUnitario  : precioUnitario,
      cantidad        : cantidad,
      subtotal        : subtotal,
      iva             : Math.round(iva),
      total           : Math.round(total),
      subtotalFormato : formatCOP(subtotal),
      ivaFormato      : formatCOP(iva),
      totalFormato    : formatCOP(total),
      timestamp       : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_detalle_pedido", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    btnRegister.disabled  = true;
    btnText.style.opacity = "0.6";

    setTimeout(() => {
      const data = saveDetallePedido();
      console.log("Detalle pedido guardado:", data);

      btnRegister.disabled  = false;
      btnText.style.opacity = "";

      window.location.href = "/ASSETS/EstadoPedido.html";
    }, 600);
  });

});