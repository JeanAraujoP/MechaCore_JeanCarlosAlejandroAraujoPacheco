// ─────────────────────────────────────────────
//  MechaCore – Detalle Factura  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form          = document.getElementById("registerForm");
  const inputCantidad = document.getElementById("cantidad");
  const inputSubTotal = document.getElementById("subTotal");
  const btnRegister   = document.querySelector(".btn-register");
  const btnText       = document.querySelector(".btn-text");

  // ── Precios por producto (según catálogo de Categoría) ──
  const precios = {
    // Sensores
    "Sensor ultrasónico HC-SR04"      : 18500,
    "Sensor infrarrojo TCRT5000"      : 9800,
    "Sensor de temperatura DHT22"     : 22000,
    "Sensor de presión BMP280"        : 27500,
    "Sensor de corriente ACS712"      : 19000,
    "Sensor de humedad HIH-4030"      : 31000,
    "Sensor de proximidad PIR HC-SR501": 14500,
    "Sensor de color TCS3200"         : 38000,
    // Motores
    "Motor DC 12V 100RPM"             : 45000,
    "Motor paso a paso NEMA 17"       : 89000,
    "Servo motor SG90"                : 15000,
    "Servo motor MG996R"              : 35000,
    "Motor brushless 2300KV"          : 120000,
    "Motor DC con encoder 6V"         : 67000,
    "Motor lineal 12V 50N"            : 95000,
    "Motor vibrador 3V"               : 8500,
    // Controladores
    "Arduino UNO R3"                  : 65000,
    "Arduino MEGA 2560"               : 95000,
    "Raspberry Pi 4 Model B"          : 280000,
    "ESP32 DevKit V1"                 : 35000,
    "ESP8266 NodeMCU"                 : 22000,
    "STM32 Blue Pill"                 : 28000,
    "Teensy 4.1"                      : 180000,
    "BeagleBone Black"                : 320000,
    // Componentes electrónicos
    "Resistencias 1/4W (pack 100)"    : 8000,
    "Capacitores electrolíticos (pack 50)": 12000,
    "Transistor NPN 2N2222"           : 1500,
    "Módulo relé 5V 4 canales"        : 28000,
    "Puente H L298N"                  : 22000,
    "Regulador de voltaje LM7805"     : 4500,
    "Diodo rectificador 1N4007"       : 800,
    "LED RGB 5mm (pack 20)"           : 9500,
  };

  // Precio por defecto si el producto no está en la tabla
  const PRECIO_DEFAULT = 10000;

  // ── Leer producto seleccionado desde localStorage ──
  let precioUnitario = PRECIO_DEFAULT;
  let productoNombre = "Producto";

  const categoriaData = localStorage.getItem("mechacore_categoria");
  if (categoriaData) {
    try {
      const parsed = JSON.parse(categoriaData);
      productoNombre = parsed.producto || "Producto";
      precioUnitario = precios[productoNombre] ?? PRECIO_DEFAULT;
    } catch (_) {}
  }

  // ── Mostrar precio unitario de referencia ────
  const refEl = document.createElement("p");
  refEl.style.cssText =
    "font-size:.8rem;color:#888;margin-bottom:8px;margin-top:-4px";
  refEl.innerHTML =
    `<i class="fas fa-tag"></i> <strong>${productoNombre}</strong> — ` +
    `Precio unitario: <strong>${formatCOP(precioUnitario)}</strong>`;
  inputCantidad.closest(".form-group").insertAdjacentElement("afterend", refEl);

  // ── Formato moneda COP ───────────────────────
  function formatCOP(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);
  }

  // ── Calcular subtotal ─────────────────────────
  function calcularTotal() {
    const cantidad = parseInt(inputCantidad.value, 10);

    if (!cantidad || cantidad <= 0) {
      inputSubTotal.value = "";
      return;
    }

    const subtotal = cantidad * precioUnitario;
    inputSubTotal.value = formatCOP(subtotal);
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
    el.style.borderColor = msg ? "#e74c3c" : "";
  }

  function clearError(el) { setError(el, ""); }

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
    } else if (!Number.isInteger(cantidad)) {
      setError(inputCantidad, "La cantidad debe ser un número entero.");
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveDetalleFactura() {
    const cantidad  = parseInt(inputCantidad.value, 10);
    const subtotal  = cantidad * precioUnitario;
    const data = {
      producto       : productoNombre,
      precioUnitario : precioUnitario,
      cantidad       : cantidad,
      subTotal       : subtotal,
      subTotalFormato: formatCOP(subtotal),
      timestamp      : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_detalle_factura", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    btnRegister.disabled  = true;
    btnText.style.opacity = "0.6";

    setTimeout(() => {
      const data = saveDetalleFactura();
      console.log("Detalle factura guardado:", data);

      btnRegister.disabled  = false;
      btnText.style.opacity = "";

      window.location.href = "/ASSETS/DetallePedido.html";
    }, 600);
  });

});