// ─────────────────────────────────────────────
//  MechaCore – Cabeza Pedido  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form               = document.getElementById("registrationForm");
  const inputNumeroPedido  = document.getElementById("numeroPedido");
  const inputFechaPedido   = document.getElementById("fechaPedido");
  const inputFechaEstimada = document.getElementById("fechaEstimadaPedido");
  const inputTotal         = document.getElementById("totalPedido");
  const checkTerms         = document.getElementById("terms");
  const termsError         = document.getElementById("termsError");
  const btnRegister        = document.querySelector(".btn-register");
  const btnText            = document.querySelector(".btn-text");
  const spinner            = document.querySelector(".spinner");
  const toast              = document.getElementById("toast");

  // ── Fecha mínima = hoy ───────────────────────
  const today = new Date().toISOString().split("T")[0];
  inputFechaPedido.setAttribute("min", today);
  inputFechaEstimada.setAttribute("min", today);

  // Cuando cambia fechaPedido, la estimada no puede ser anterior
  inputFechaPedido.addEventListener("change", () => {
    const val = inputFechaPedido.value;
    if (val) inputFechaEstimada.setAttribute("min", val);
    clearError(inputFechaPedido);
  });

  // ── Utilidades ──────────────────────────────

  function setError(input, msg) {
    const wrapper = input.closest(".fg") || input.closest(".form-group");
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
    if (input.type !== "checkbox") input.style.borderColor = msg ? "#e74c3c" : "";
  }

  function clearError(input) {
    setError(input, "");
  }

  // ── Limpiar errores al interactuar ───────────
  [inputNumeroPedido, inputFechaEstimada, inputTotal].forEach((el) =>
    el.addEventListener("input", () => clearError(el))
  );

  checkTerms.addEventListener("change", () => {
    termsError.textContent = "";
  });

  // ── Spinner ──────────────────────────────────
  function setLoading(active) {
    if (active) {
      btnText.style.display = "none";
      spinner.classList.remove("hidden");
      btnRegister.disabled = true;
    } else {
      btnText.style.display = "";
      spinner.classList.add("hidden");
      btnRegister.disabled = false;
    }
  }

  // ── Toast ────────────────────────────────────
  function showToast(message = "¡Pedido registrado con éxito!") {
    toast.innerHTML = `<i class="fas fa-check-circle toast-icon"></i> ${message}`;
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 400);
    }, 3000);
  }

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;

    // Número de pedido
    const numero = inputNumeroPedido.value.trim();
    if (!numero) {
      setError(inputNumeroPedido, "El número de pedido es obligatorio.");
      valid = false;
    } else if (!/^[A-Za-z0-9\-]+$/.test(numero)) {
      setError(inputNumeroPedido, "Solo letras, números y guiones.");
      valid = false;
    }

    // Fecha pedido
    if (!inputFechaPedido.value) {
      setError(inputFechaPedido, "La fecha del pedido es obligatoria.");
      valid = false;
    }

    // Fecha estimada
    if (!inputFechaEstimada.value) {
      setError(inputFechaEstimada, "La fecha estimada es obligatoria.");
      valid = false;
    } else if (
      inputFechaPedido.value &&
      inputFechaEstimada.value < inputFechaPedido.value
    ) {
      setError(
        inputFechaEstimada,
        "La fecha estimada no puede ser anterior a la fecha del pedido."
      );
      valid = false;
    }

    // Total
    const total = inputTotal.value;
    if (total === "" || total === null) {
      setError(inputTotal, "El total del pedido es obligatorio.");
      valid = false;
    } else if (parseFloat(total) <= 0) {
      setError(inputTotal, "El total debe ser mayor a 0.");
      valid = false;
    }

    // Términos
    if (!checkTerms.checked) {
      termsError.textContent = "Debes aceptar los términos y condiciones.";
      termsError.style.color = "#e74c3c";
      termsError.style.fontSize = ".75rem";
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function savePedido() {
    const pedido = {
      numeroPedido      : inputNumeroPedido.value.trim(),
      fechaPedido       : inputFechaPedido.value,
      fechaEstimadaPedido: inputFechaEstimada.value,
      totalPedido       : parseFloat(inputTotal.value),
      timestamp         : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_cabeza_pedido", JSON.stringify(pedido));
    return pedido;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const pedido = savePedido();
      console.log("Pedido guardado:", pedido);

      showToast(`Pedido #${pedido.numeroPedido} registrado correctamente.`);

      // Redirige tras el toast
      setTimeout(() => {
        window.location.href = "/ASSETS/Categoria.html";
      }, 1500);

    }, 900);
  });

});