// ─────────────────────────────────────────────
//  MechaCore – Método de Pago  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Corregir values duplicados del select ────
  // El HTML tiene todas las opciones con value="ce"
  // Se corrigen dinámicamente para que funcionen bien
  const valoresCorrectos = [
    { value: "credito",   text: "Tarjeta de Crédito" },
    { value: "debito",    text: "Tarjeta de Débito"  },
    { value: "paypal",    text: "PayPal"              },
    { value: "nubank",    text: "Nu Bank"             },
    { value: "daviplata", text: "Daviplata"           },
    { value: "nequi",     text: "Nequi"               },
  ];

  const selectPago = document.getElementById("documentType");

  // Reconstruir opciones con values correctos
  const placeholder = selectPago.options[0];
  selectPago.innerHTML = "";
  selectPago.appendChild(placeholder);

  valoresCorrectos.forEach(({ value, text }) => {
    const opt = document.createElement("option");
    opt.value       = value;
    opt.textContent = text;
    selectPago.appendChild(opt);
  });

  // ── Referencias al DOM ──────────────────────
  const form          = document.querySelector("form") || document.getElementById("registerForm");
  const checkTerms    = document.getElementById("terms");
  const docTypeError  = document.getElementById("documentTypeError");
  const termsError    = document.getElementById("termsError");
  const btnRegister   = document.querySelector(".btn-register");
  const btnText       = document.querySelector(".btn-text");
  const spinner       = document.querySelector(".spinner");
  const toast         = document.getElementById("toast");

  // ── Info por método de pago ──────────────────
  const infoPagos = {
    credito: {
      icon  : "fa-credit-card",
      color : "#3498db",
      titulo: "Tarjeta de Crédito",
      detalle: "Paga en cuotas. Se aplican intereses según tu banco.",
    },
    debito: {
      icon  : "fa-credit-card",
      color : "#8e44ad",
      titulo: "Tarjeta de Débito",
      detalle: "Débito inmediato desde tu cuenta. Sin intereses.",
    },
    paypal: {
      icon  : "fa-paypal",
      color : "#003087",
      titulo: "PayPal",
      detalle: "Pago seguro con tu cuenta PayPal. Cobertura internacional.",
    },
    nubank: {
      icon  : "fa-mobile-alt",
      color : "#820ad1",
      titulo: "Nu Bank",
      detalle: "Pago digital con tu tarjeta Nu. Rápido y sin comisiones.",
    },
    daviplata: {
      icon  : "fa-mobile-alt",
      color : "#e30613",
      titulo: "Daviplata",
      detalle: "Billetera digital Davivienda. Transferencia inmediata.",
    },
    nequi: {
      icon  : "fa-mobile-alt",
      color : "#6c2d8f",
      titulo: "Nequi",
      detalle: "Billetera digital Bancolombia. Gratuito y seguro.",
    },
  };

  // ── Panel informativo ────────────────────────
  const infoPanel = document.createElement("div");
  infoPanel.style.cssText =
    "display:none;align-items:center;gap:10px;padding:10px 14px;" +
    "border-radius:8px;margin-top:8px;font-size:.83rem;transition:all .3s";
  selectPago.closest(".form-group").appendChild(infoPanel);

  selectPago.addEventListener("change", () => {
    const val  = selectPago.value;
    const info = infoPagos[val];
    docTypeError.textContent = "";
    selectPago.style.borderColor = "";

    if (!info) {
      infoPanel.style.display = "none";
      return;
    }

    infoPanel.style.display    = "flex";
    infoPanel.style.background = info.color + "15";
    infoPanel.style.borderLeft = `4px solid ${info.color}`;
    infoPanel.style.color      = info.color;
    infoPanel.innerHTML =
      `<i class="fas ${info.icon}" style="font-size:1.4rem"></i>` +
      `<div><strong>${info.titulo}</strong><br>` +
      `<span style="color:#555;font-size:.78rem">${info.detalle}</span></div>`;
  });

  checkTerms.addEventListener("change", () => {
    termsError.textContent = "";
  });

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

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;

    if (!selectPago.value) {
      docTypeError.textContent  = "Selecciona un método de pago.";
      docTypeError.style.color  = "#e74c3c";
      docTypeError.style.fontSize = ".75rem";
      selectPago.style.borderColor = "#e74c3c";
      valid = false;
    }

    if (!checkTerms.checked) {
      termsError.textContent  = "Debes aceptar los términos y condiciones.";
      termsError.style.color  = "#e74c3c";
      termsError.style.fontSize = ".75rem";
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveMetodoPago() {
    const val  = selectPago.value;
    const info = infoPagos[val];
    const data = {
      metodoPago     : val,
      metodoPagoLabel: info?.titulo ?? val,
      timestamp      : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_metodo_pago", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const data = saveMetodoPago();
      console.log("Método de pago guardado:", data);

      showToast(`Método seleccionado: ${data.metodoPagoLabel}`);

      setTimeout(() => {
        window.location.href = "/ASSETS/Pago.html";
      }, 1500);
    }, 900);
  });

});