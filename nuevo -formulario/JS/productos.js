// ─────────────────────────────────────────────
//  MechaCore – Producto  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── El HTML tiene IDs duplicados (dos #fullname, dos #registerForm)
  //    Se toman los elementos por posición donde sea necesario ──────
  const allInputs   = document.querySelectorAll("input[id='fullname']");
  const inputNombre = allInputs[0] ?? null;
  const inputDescr  = allInputs[1] ?? null;

  const form          = document.getElementById("registerForm");
  const selectProd    = document.getElementById("DocumentTyper");
  const inputPrecio   = document.getElementById("precio");
  const docTypeError  = document.getElementById("documentTypeError");
  const btnRegister   = document.querySelector(".btn-register");
  const btnText       = document.querySelector(".btn-text");
  const spinner       = document.querySelector(".spinner");
  const toast         = document.getElementById("toast");

  // Spans de error para nombre y descripción
  const errorSpans = document.querySelectorAll("span.error-message[id='fullnameError']");
  const errNombre  = errorSpans[0] ?? null;
  const errDescr   = errorSpans[1] ?? null;

  // ── Catálogo de precios por producto ─────────
  const precios = {
    proximidad  : { precio: 14500,  label: "Sensores de proximidad"        },
    ultrasonicos: { precio: 18500,  label: "Sensores ultrasónicos"          },
    temperatura : { precio: 22000,  label: "Sensores de temperatura"        },
    presion     : { precio: 27500,  label: "Sensores de presión"            },
    infrarrojos : { precio: 16000,  label: "Sensores de luz o infrarrojos"  },
    giroscopios : { precio: 45000,  label: "Acelerómetros y giroscopios"    },
  };

  // ── Formato moneda COP ───────────────────────
  function formatCOP(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency", currency: "COP", minimumFractionDigits: 0,
    }).format(value);
  }

  // ── mostrarPrecio (llamado por onchange del select) ──
  function mostrarPrecio() {
    const val  = selectProd.value;
    const item = precios[val];

    docTypeError.textContent     = "";
    selectProd.style.borderColor = "";

    if (!item) {
      inputPrecio.value = "";
      ocultarDetalle();
      return;
    }

    inputPrecio.value = formatCOP(item.precio);
    mostrarDetalle(val, item);
  }

  // Exponer globalmente (el HTML usa onchange="mostrarPrecio()")
  window.mostrarPrecio = mostrarPrecio;

  // ── Panel detalle del producto ───────────────
  const detalles = {
    proximidad  : { icon: "fa-satellite-dish", color: "#3498db",
                    desc: "Detecta objetos cercanos sin contacto. Ideal para robótica." },
    ultrasonicos: { icon: "fa-broadcast-tower", color: "#8e44ad",
                    desc: "Mide distancias con ondas sonoras. Rango hasta 4 metros." },
    temperatura : { icon: "fa-thermometer-half", color: "#e74c3c",
                    desc: "Monitoreo térmico de alta precisión. ±0.5°C de exactitud." },
    presion     : { icon: "fa-tachometer-alt", color: "#e67e22",
                    desc: "Mide presión barométrica y altitud. Compatible con I2C." },
    infrarrojos : { icon: "fa-eye", color: "#27ae60",
                    desc: "Detección de luz IR y objetos reflectantes." },
    giroscopios : { icon: "fa-compass", color: "#2c3e50",
                    desc: "Mide aceleración y orientación en 3 ejes. Precisión IMU." },
  };

  const detallePanel = document.createElement("div");
  detallePanel.style.cssText =
    "display:none;align-items:center;gap:10px;padding:10px 14px;" +
    "border-radius:8px;margin-top:8px;font-size:.83rem;";
  selectProd.closest(".form-group").appendChild(detallePanel);

  function mostrarDetalle(val, item) {
    const d = detalles[val];
    if (!d) { ocultarDetalle(); return; }
    detallePanel.style.display    = "flex";
    detallePanel.style.background = d.color + "15";
    detallePanel.style.borderLeft = `4px solid ${d.color}`;
    detallePanel.style.color      = d.color;
    detallePanel.innerHTML =
      `<i class="fas ${d.icon}" style="font-size:1.3rem"></i>` +
      `<div><strong>${item.label}</strong> — ${formatCOP(item.precio)}<br>` +
      `<span style="color:#555;font-size:.78rem">${d.desc}</span></div>`;
  }

  function ocultarDetalle() {
    detallePanel.style.display = "none";
  }

  // ── Utilidades de error ──────────────────────
  function setFieldError(input, spanEl, msg) {
    if (spanEl) {
      spanEl.textContent  = msg;
      spanEl.style.color  = "#e74c3c";
      spanEl.style.fontSize = ".75rem";
    }
    if (input) input.style.borderColor = msg ? "#e74c3c" : "";
  }

  function setError(el, msg) {
    const wrapper = el.closest(".form-group") || el.closest(".fg");
    if (!wrapper) return;
    let errorEl = wrapper.querySelector(".error-msg");
    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "error-msg";
      errorEl.style.cssText =
        "color:#e74c3c;font-size:.75rem;margin-top:4px;display:block";
      wrapper.appendChild(errorEl);
    }
    errorEl.textContent  = msg;
    el.style.borderColor = msg ? "#e74c3c" : "";
  }

  // Limpiar errores al escribir
  if (inputNombre) inputNombre.addEventListener("input", () => setFieldError(inputNombre, errNombre, ""));
  if (inputDescr)  inputDescr.addEventListener("input",  () => setFieldError(inputDescr,  errDescr,  ""));

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;

    // Nombre
    const nombre = inputNombre?.value.trim();
    if (!nombre) {
      setFieldError(inputNombre, errNombre, "El nombre del producto es obligatorio.");
      valid = false;
    } else if (nombre.length < 2) {
      setFieldError(inputNombre, errNombre, "El nombre debe tener al menos 2 caracteres.");
      valid = false;
    }

    // Descripción
    const descr = inputDescr?.value.trim();
    if (!descr) {
      setFieldError(inputDescr, errDescr, "La descripción es obligatoria.");
      valid = false;
    } else if (descr.length < 5) {
      setFieldError(inputDescr, errDescr, "La descripción debe tener al menos 5 caracteres.");
      valid = false;
    }

    // Producto más vendido
    if (!selectProd.value) {
      docTypeError.textContent    = "Selecciona un producto.";
      docTypeError.style.color    = "#e74c3c";
      docTypeError.style.fontSize = ".75rem";
      selectProd.style.borderColor = "#e74c3c";
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
  function saveProducto() {
    const val  = selectProd.value;
    const item = precios[val];
    const data = {
      nombre      : inputNombre?.value.trim() ?? "",
      descripcion : inputDescr?.value.trim()  ?? "",
      producto    : val,
      productoLabel: item?.label ?? val,
      precio      : item?.precio ?? 0,
      precioFormato: formatCOP(item?.precio ?? 0),
      timestamp   : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_producto", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const data = saveProducto();
      console.log("Producto guardado:", data);

      showToast(`${data.productoLabel} registrado — ${data.precioFormato}`);

      setTimeout(() => {
        window.location.href = "/ASSETS/rol.html";
      }, 1500);
    }, 900);
  });

});