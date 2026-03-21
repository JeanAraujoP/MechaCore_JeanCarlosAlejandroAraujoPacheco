// ─────────────────────────────────────────────
//  MechaCore – Cabeza Factura  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form           = document.getElementById("registrationForm");
  const inputNumero    = document.getElementById("numeroFactura");
  const inputFecha     = document.getElementById("fechaVenta");
  const inputTotal     = document.getElementById("total");
  const btnRegister    = document.querySelector(".btn-register");
  const btnText        = document.querySelector(".btn-text");
  const spinner        = document.querySelector(".spinner");
  const toast          = document.getElementById("toast");

  // ── Utilidades ──────────────────────────────

  /**
   * Muestra un mensaje de error debajo del campo.
   * Si msg es vacío, limpia el error.
   */
  function setError(input, msg) {
    const wrapper = input.closest(".fg");
    let errorEl = wrapper.querySelector(".error-msg");

    if (!errorEl) {
      errorEl = document.createElement("span");
      errorEl.className = "error-msg";
      errorEl.style.cssText =
        "color:#e74c3c;font-size:.75rem;margin-top:4px;display:block";
      wrapper.appendChild(errorEl);
    }

    errorEl.textContent = msg;
    input.style.borderColor = msg ? "#e74c3c" : "";
  }

  function clearError(input) {
    setError(input, "");
  }

  /** Formatea número con separadores de miles → "1.250.000" */
  function formatNumber(value) {
    return parseFloat(value).toLocaleString("es-CO");
  }

  /** Valida formato de fecha DD/MM/AAAA */
  function isValidDate(str) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(str)) return false;
    const [, d, m, y] = str.match(regex).map(Number);
    const date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  }

  // ── Auto-formato fecha mientras se escribe ──
  inputFecha.addEventListener("input", (e) => {
    let val = e.target.value.replace(/\D/g, ""); // solo dígitos
    if (val.length > 2)  val = val.slice(0, 2)  + "/" + val.slice(2);
    if (val.length > 5)  val = val.slice(0, 5)  + "/" + val.slice(5);
    if (val.length > 10) val = val.slice(0, 10);
    e.target.value = val;
    clearError(inputFecha);
  });

  // ── Limpiar errores al escribir ─────────────
  inputNumero.addEventListener("input", () => clearError(inputNumero));
  inputTotal.addEventListener("input",  () => clearError(inputTotal));

  // ── Mostrar / ocultar spinner ────────────────
  function setLoading(active) {
    if (active) {
      btnText.style.display  = "none";
      spinner.classList.remove("hidden");
      btnRegister.disabled   = true;
    } else {
      btnText.style.display  = "";
      spinner.classList.add("hidden");
      btnRegister.disabled   = false;
    }
  }

  // ── Toast de éxito ───────────────────────────
  function showToast(message = "¡Factura registrada con éxito!") {
    toast.innerHTML = `<i class="fas fa-check-circle toast-icon"></i> ${message}`;
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 400);
    }, 3000);
  }

  // ── Validación completa del formulario ───────
  function validateForm() {
    let valid = true;

    // Número de factura
    const numero = inputNumero.value.trim();
    if (!numero) {
      setError(inputNumero, "El número de factura es obligatorio.");
      valid = false;
    } else if (!/^[A-Za-z0-9\-]+$/.test(numero)) {
      setError(inputNumero, "Solo letras, números y guiones.");
      valid = false;
    }

    // Fecha de venta
    const fecha = inputFecha.value.trim();
    if (!fecha) {
      setError(inputFecha, "La fecha de venta es obligatoria.");
      valid = false;
    } else if (!isValidDate(fecha)) {
      setError(inputFecha, "Formato inválido. Use DD/MM/AAAA.");
      valid = false;
    }

    // Total factura
    const total = inputTotal.value;
    if (total === "" || total === null) {
      setError(inputTotal, "El total de la factura es obligatorio.");
      valid = false;
    } else if (parseFloat(total) <= 0) {
      setError(inputTotal, "El total debe ser mayor a 0.");
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveFactura() {
    const factura = {
      numeroFactura : inputNumero.value.trim(),
      fechaVenta    : inputFecha.value.trim(),
      total         : parseFloat(inputTotal.value),
      timestamp     : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_cabeza_factura", JSON.stringify(factura));
    return factura;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita la navegación inmediata del <a>

    if (!validateForm()) return;

    setLoading(true);

    // Simula latencia de guardado (e.g. llamada a API)
    setTimeout(() => {
      setLoading(false);

      const factura = saveFactura();
      console.log("Factura guardada:", factura);
      console.log("Total formateado:", formatNumber(factura.total));

      showToast(`Factura #${factura.numeroFactura} registrada correctamente.`);

      // Redirige después de mostrar el toast
      setTimeout(() => {
        window.location.href = "/ASSETS/CabezaPedido.html";
      }, 1500);

    }, 900);
  });

});