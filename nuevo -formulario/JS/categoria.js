// ─────────────────────────────────────────────
//  MechaCore – Categoría  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Catálogo de productos por categoría ──────
  const catalogo = {
    sensores: [
      "Sensor ultrasónico HC-SR04",
      "Sensor infrarrojo TCRT5000",
      "Sensor de temperatura DHT22",
      "Sensor de presión BMP280",
      "Sensor de corriente ACS712",
      "Sensor de humedad HIH-4030",
      "Sensor de proximidad PIR HC-SR501",
      "Sensor de color TCS3200",
    ],
    motores: [
      "Motor DC 12V 100RPM",
      "Motor paso a paso NEMA 17",
      "Servo motor SG90",
      "Servo motor MG996R",
      "Motor brushless 2300KV",
      "Motor DC con encoder 6V",
      "Motor lineal 12V 50N",
      "Motor vibrador 3V",
    ],
    controladores: [
      "Arduino UNO R3",
      "Arduino MEGA 2560",
      "Raspberry Pi 4 Model B",
      "ESP32 DevKit V1",
      "ESP8266 NodeMCU",
      "STM32 Blue Pill",
      "Teensy 4.1",
      "BeagleBone Black",
    ],
    componentes: [
      "Resistencias 1/4W (pack 100)",
      "Capacitores electrolíticos (pack 50)",
      "Transistor NPN 2N2222",
      "Módulo relé 5V 4 canales",
      "Puente H L298N",
      "Regulador de voltaje LM7805",
      "Diodo rectificador 1N4007",
      "LED RGB 5mm (pack 20)",
    ],
  };

  // ── Referencias al DOM ──────────────────────
  const selectCategoria = document.getElementById("categoria");
  const selectProductos  = document.getElementById("productos");
  const form             = document.querySelector("form");
  const btnRegister      = document.querySelector(".btn-register");
  const btnText          = document.querySelector(".btn-text");

  // ── Poblar select de productos ───────────────
  function mostrarProductos() {
    const categoria = selectCategoria.value;

    // Limpiar opciones anteriores
    selectProductos.innerHTML = "";

    if (!categoria || !catalogo[categoria]) {
      selectProductos.innerHTML =
        '<option value="" disabled selected>Primero seleccione una categoría</option>';
      return;
    }

    // Opción placeholder
    const placeholder = document.createElement("option");
    placeholder.value    = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = "Seleccione un producto";
    selectProductos.appendChild(placeholder);

    // Añadir productos de la categoría
    catalogo[categoria].forEach((producto) => {
      const opt = document.createElement("option");
      opt.value       = producto;
      opt.textContent = producto;
      selectProductos.appendChild(opt);
    });

    clearError(selectCategoria);
  }

  // Exponer globalmente por si el HTML usa onchange="mostrarProductos()"
  window.mostrarProductos = mostrarProductos;

  // ── Utilidades de error ──────────────────────
  function setError(select, msg) {
    const wrapper = select.closest(".form-group");
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
    select.style.borderColor = msg ? "#e74c3c" : "";
  }

  function clearError(select) {
    setError(select, "");
  }

  selectProductos.addEventListener("change", () => clearError(selectProductos));

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;

    if (!selectCategoria.value) {
      setError(selectCategoria, "Selecciona una categoría.");
      valid = false;
    }

    if (!selectProductos.value) {
      setError(selectProductos, "Selecciona un producto de la categoría.");
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveCategoria() {
    const data = {
      categoria : selectCategoria.value,
      producto  : selectProductos.value,
      timestamp : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_categoria", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Deshabilitar botón brevemente
    btnRegister.disabled  = true;
    btnText.style.opacity = "0.6";

    setTimeout(() => {
      const data = saveCategoria();
      console.log("Categoría guardada:", data);

      btnRegister.disabled  = false;
      btnText.style.opacity = "";

      window.location.href = "/ASSETS/Ciudad.html";
    }, 600);
  });

});