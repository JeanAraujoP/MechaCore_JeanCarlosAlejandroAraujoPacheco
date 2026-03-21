// ─────────────────────────────────────────────
//  MechaCore – Estado Pedido  |  estadopedido.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form            = document.getElementById("registerForm");
  const selectProducto  = document.getElementById("producto");
  const inputDescripcion= document.getElementById("descripcion");
  const inputAplicaciones=document.getElementById("aplicaciones");
  const inputUrlImagen  = document.getElementById("urlimagen");
  const inputUrlPinout  = document.getElementById("urlpinout");
  const docTypeError    = document.getElementById("documentTypeError");
  const checkTerms      = document.getElementById("terms");
  const btnRegister     = document.querySelector(".btn-register");
  const btnText         = document.querySelector(".btn-text");

  // ── Catálogo de productos ────────────────────
  const catalogo = {
    arduino: {
      label      : "Arduino Uno",
      descripcion: "Microcontrolador de código abierto basado en el chip ATmega328P. Cuenta con 14 pines digitales I/O, 6 entradas analógicas, cristal de 16 MHz, conexión USB y conector de alimentación.",
      aplicaciones: "Robótica, automatización del hogar, sistemas de control, prototipado electrónico, IoT educativo.",
      urlImagen  : "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
      urlPinout  : "https://content.arduino.cc/assets/Pinout-UNOrev3_latest.png",
      color      : "#00979D",
      icon       : "fa-microchip",
    },
    sensor: {
      label      : "Sensor Ultrasónico HC-SR04",
      descripcion: "Sensor de distancia por ultrasonido con rango de 2 cm a 400 cm y precisión de ±3 mm. Opera a 5V, frecuencia de 40 kHz. Pines: VCC, Trig, Echo, GND.",
      aplicaciones: "Medición de distancias, detección de obstáculos, nivel de líquidos, sistemas de estacionamiento, robótica móvil.",
      urlImagen  : "https://www.electrosoftcloud.com/wp-content/uploads/2021/04/HC-SR04.jpg",
      urlPinout  : "https://components101.com/sites/default/files/component_pin/HC-SR04-Ultrasonic-Sensor-Pinout.jpg",
      color      : "#3498db",
      icon       : "fa-broadcast-tower",
    },
    motor: {
      label      : "Motor Servo SG90",
      descripcion: "Micro servo de 9g con torque de 1.8 kg/cm a 4.8V. Rotación de 0° a 180°. Control PWM con frecuencia de 50 Hz y pulso de 1–2 ms. Conector universal de 3 pines.",
      aplicaciones: "Brazos robóticos, dirección de vehículos RC, cámaras pan-tilt, sistemas de apertura, animatrónica.",
      urlImagen  : "https://www.electronicoscaldas.com/22-large_default/micro-servo-sg90-9g.jpg",
      urlPinout  : "https://components101.com/sites/default/files/component_pin/SG90-Servo-Motor-Pinout.jpg",
      color      : "#e67e22",
      icon       : "fa-cog",
    },
  };

  // ── Preview de imagen ────────────────────────
  const imgPreview = document.createElement("div");
  imgPreview.style.cssText =
    "display:none;margin-top:10px;text-align:center;";
  inputUrlImagen.closest(".form-group").insertAdjacentElement("afterend", imgPreview);

  // ── mostrarProducto (llamado por onchange) ───
  function mostrarProducto() {
    const val  = selectProducto.value;
    const item = catalogo[val];

    docTypeError.textContent      = "";
    selectProducto.style.borderColor = "";

    // Limpiar si no hay selección
    if (!val || !item) {
      [inputDescripcion, inputAplicaciones, inputUrlImagen, inputUrlPinout]
        .forEach(el => el.value = "");
      imgPreview.style.display = "none";
      ocultarInfoCard();
      return;
    }

    // Rellenar campos readonly
    inputDescripcion.value  = item.descripcion;
    inputAplicaciones.value = item.aplicaciones;
    inputUrlImagen.value    = item.urlImagen;
    inputUrlPinout.value    = item.urlPinout;

    // Preview de imagen
    imgPreview.style.display = "block";
    imgPreview.innerHTML = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
        <div style="text-align:center">
          <p style="font-size:.72rem;color:#888;margin-bottom:4px">Imagen del producto</p>
          <img src="${item.urlImagen}" alt="${item.label}"
               style="max-width:140px;max-height:100px;border-radius:8px;
                      border:1px solid #e0e0e0;object-fit:contain;padding:4px;background:#fff"
               onerror="this.style.display='none'">
        </div>
        <div style="text-align:center">
          <p style="font-size:.72rem;color:#888;margin-bottom:4px">Pinout</p>
          <img src="${item.urlPinout}" alt="Pinout ${item.label}"
               style="max-width:140px;max-height:100px;border-radius:8px;
                      border:1px solid #e0e0e0;object-fit:contain;padding:4px;background:#fff"
               onerror="this.style.display='none'">
        </div>
      </div>
    `;

    mostrarInfoCard(val, item);
  }

  // Exponer globalmente (el HTML usa onchange="mostrarProducto()")
  window.mostrarProducto = mostrarProducto;

  // ── Card informativa del producto ────────────
  const infoCard = document.createElement("div");
  infoCard.style.cssText =
    "display:none;padding:12px 14px;border-radius:8px;" +
    "margin-top:8px;font-size:.83rem;";
  selectProducto.closest(".form-group").appendChild(infoCard);

  function mostrarInfoCard(val, item) {
    infoCard.style.display    = "flex";
    infoCard.style.alignItems = "flex-start";
    infoCard.style.gap        = "10px";
    infoCard.style.background = item.color + "12";
    infoCard.style.borderLeft = `4px solid ${item.color}`;
    infoCard.innerHTML =
      `<i class="fas ${item.icon}" style="color:${item.color};font-size:1.3rem;margin-top:2px"></i>` +
      `<div>` +
      `<strong style="color:${item.color}">${item.label}</strong><br>` +
      `<span style="color:#555;font-size:.78rem">${item.descripcion.slice(0, 90)}…</span>` +
      `</div>`;
  }

  function ocultarInfoCard() {
    infoCard.style.display = "none";
  }

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

    if (!selectProducto.value || selectProducto.value === "") {
      docTypeError.textContent     = "Selecciona un producto.";
      docTypeError.style.color     = "#e74c3c";
      docTypeError.style.fontSize  = ".75rem";
      selectProducto.style.borderColor = "#e74c3c";
      valid = false;
    }

    if (!checkTerms.checked) {
      setError(checkTerms, "Debes aceptar los términos y condiciones.");
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveEstadoPedido() {
    const val  = selectProducto.value;
    const item = catalogo[val];
    const data = {
      producto     : val,
      productoLabel: item?.label        ?? val,
      descripcion  : inputDescripcion.value,
      aplicaciones : inputAplicaciones.value,
      urlImagen    : inputUrlImagen.value,
      urlPinout    : inputUrlPinout.value,
      timestamp    : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_estado_pedido", JSON.stringify(data));
    return data;
  }

  // ── actualizarInventario (onclick del botón) ─
  function actualizarInventario() {
    if (!validateForm()) return;

    btnRegister.disabled  = true;
    btnText.style.opacity = "0.6";

    setTimeout(() => {
      const data = saveEstadoPedido();
      console.log("Estado pedido guardado:", data);

      btnRegister.disabled  = false;
      btnText.style.opacity = "";

      window.location.href = "/ASSETS/EstadoUsuario.html";
    }, 600);
  }

  // Exponer globalmente (el HTML usa onclick="actualizarInventario()")
  window.actualizarInventario = actualizarInventario;

  // ── Submit como fallback ─────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    actualizarInventario();
  });

});x