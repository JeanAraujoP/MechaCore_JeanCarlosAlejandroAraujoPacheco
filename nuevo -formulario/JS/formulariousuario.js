// ─────────────────────────────────────────────
//  MechaCore – Formulario Usuario  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form                  = document.getElementById("registerForm");
  const inputFullname         = document.getElementById("fullname");
  const inputLastname         = document.getElementById("lastname");
  const selectDocType         = document.getElementById("documentType");
  const inputDocNumber        = document.getElementById("documentNumber");
  const inputTelephone        = document.getElementById("telephoneNumber");
  const inputAddress          = document.getElementById("address");
  const inputEmail            = document.getElementById("email");
  const inputPassword         = document.getElementById("password");
  const inputConfirm          = document.getElementById("confirmPassword");
  const checkTerms            = document.getElementById("terms");
  const btnRegister           = document.querySelector(".btn-register");
  const btnText               = document.querySelector(".btn-text");
  const spinner               = document.querySelector(".spinner");
  const toast                 = document.getElementById("toast");

  // Spans de error del HTML
  const errors = {
    fullname      : document.getElementById("fullnameError"),
    lastname      : document.getElementById("lastnameError"),
    documentType  : document.getElementById("documentTypeError"),
    documentNumber: document.getElementById("documentNumberError"),
    telephone     : document.getElementById("telephoneNumberError"),
    address       : document.getElementById("addressError"),
    email         : document.getElementById("emailError"),
    password      : document.getElementById("passwordError"),
    confirm       : document.getElementById("confirmPasswordError"),
    terms         : document.getElementById("termsError"),
  };

  // ── Reglas por tipo de documento ────────────
  const docRules = {
    cedula  : { min: 6,  max: 10, pattern: /^\d+$/,        hint: "6–10 dígitos numéricos" },
    ti      : { min: 10, max: 11, pattern: /^\d+$/,        hint: "10–11 dígitos numéricos" },
    ppt     : { min: 6,  max: 15, pattern: /^[A-Z0-9]+$/i, hint: "6–15 caracteres alfanuméricos" },
    ce      : { min: 6,  max: 12, pattern: /^[A-Z0-9]+$/i, hint: "6–12 caracteres alfanuméricos" },
    pep     : { min: 6,  max: 15, pattern: /^[A-Z0-9]+$/i, hint: "6–15 caracteres alfanuméricos" },
    nit     : { min: 9,  max: 10, pattern: /^\d+$/,        hint: "9–10 dígitos numéricos" },
  };

  // ── Fuerza de contraseña ─────────────────────
  const strengthBar = document.createElement("div");
  strengthBar.style.cssText =
    "height:4px;border-radius:4px;margin-top:6px;transition:all .3s;background:#eee";
  const strengthLabel = document.createElement("span");
  strengthLabel.style.cssText = "font-size:.72rem;margin-top:2px;display:block";
  inputPassword.closest(".form-group").appendChild(strengthBar);
  inputPassword.closest(".form-group").appendChild(strengthLabel);

  function getStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8)              score++;
    if (/[A-Z]/.test(pwd))            score++;
    if (/[0-9]/.test(pwd))            score++;
    if (/[^A-Za-z0-9]/.test(pwd))    score++;
    return score;
  }

  const strengthMap = [
    { label: "",          color: "#eee"    },
    { label: "Débil",     color: "#e74c3c" },
    { label: "Regular",   color: "#e67e22" },
    { label: "Buena",     color: "#f1c40f" },
    { label: "Fuerte",    color: "#27ae60" },
  ];

  inputPassword.addEventListener("input", () => {
    const score = getStrength(inputPassword.value);
    const { label, color } = strengthMap[score] ?? strengthMap[0];
    strengthBar.style.background = color;
    strengthBar.style.width      = `${score * 25}%`;
    strengthLabel.textContent    = label;
    strengthLabel.style.color    = color;
    clearError("password");
    // Re-validar confirmación si ya tiene valor
    if (inputConfirm.value) validateConfirm();
  });

  // ── Toggle mostrar/ocultar contraseña ────────
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const input    = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === "password";
      input.type       = isPassword ? "text" : "password";
      const icon = btn.querySelector("i");
      if (icon) icon.className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
    });
  });

  // ── Hint de documento ────────────────────────
  const docHint = document.createElement("span");
  docHint.style.cssText = "font-size:.72rem;color:#888;margin-top:3px;display:block";
  selectDocType.closest(".form-group").appendChild(docHint);

  selectDocType.addEventListener("change", () => {
    const rule = docRules[selectDocType.value];
    docHint.textContent = rule ? `Formato: ${rule.hint}` : "";
    clearError("documentType");
    // Re-validar número si ya tiene valor
    if (inputDocNumber.value) validateDocNumber();
  });

  // ── Limpiar errores al escribir ──────────────
  const fieldMap = [
    [inputFullname,  "fullname"],
    [inputLastname,  "lastname"],
    [inputDocNumber, "documentNumber"],
    [inputTelephone, "telephone"],
    [inputAddress,   "address"],
    [inputEmail,     "email"],
    [inputConfirm,   "confirm"],
  ];
  fieldMap.forEach(([el, key]) =>
    el.addEventListener("input", () => clearError(key))
  );
  checkTerms.addEventListener("change", () => clearError("terms"));

  // ── Utilidades de error ──────────────────────
  function setError(key, msg) {
    const el = errors[key];
    if (!el) return;
    el.textContent  = msg;
    el.style.color  = "#e74c3c";
    el.style.fontSize = ".75rem";
    // Resaltar input si aplica
    const inputEl = form.querySelector(`#${key}`) ||
                    form.querySelector(`[name="${key}"]`);
    if (inputEl && inputEl.type !== "checkbox") {
      inputEl.style.borderColor = msg ? "#e74c3c" : "";
    }
  }

  function clearError(key) { setError(key, ""); }

  // ── Validaciones individuales ────────────────
  function validateDocNumber() {
    const rule = docRules[selectDocType.value];
    const val  = inputDocNumber.value.trim();
    if (!val) {
      setError("documentNumber", "El número de identificación es obligatorio.");
      return false;
    }
    if (rule) {
      if (!rule.pattern.test(val)) {
        setError("documentNumber", `Formato incorrecto. ${rule.hint}.`);
        return false;
      }
      if (val.length < rule.min || val.length > rule.max) {
        setError("documentNumber", `Debe tener entre ${rule.min} y ${rule.max} caracteres.`);
        return false;
      }
    }
    clearError("documentNumber");
    return true;
  }

  function validateConfirm() {
    if (inputConfirm.value !== inputPassword.value) {
      setError("confirm", "Las contraseñas no coinciden.");
      return false;
    }
    clearError("confirm");
    return true;
  }

  // ── Validación completa ──────────────────────
  function validateForm() {
    let valid = true;

    // Nombre
    const nombre = inputFullname.value.trim();
    if (!nombre) {
      setError("fullname", "El nombre es obligatorio.");
      valid = false;
    } else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      setError("fullname", "Solo se permiten letras y espacios.");
      valid = false;
    }

    // Apellido
    const apellido = inputLastname.value.trim();
    if (!apellido) {
      setError("lastname", "El apellido es obligatorio.");
      valid = false;
    } else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(apellido)) {
      setError("lastname", "Solo se permiten letras y espacios.");
      valid = false;
    }

    // Tipo de documento
    if (!selectDocType.value) {
      setError("documentType", "Selecciona un tipo de documento.");
      valid = false;
    }

    // Número de documento
    if (!validateDocNumber()) valid = false;

    // Teléfono
    const tel = inputTelephone.value.trim();
    if (!tel) {
      setError("telephone", "El número de teléfono es obligatorio.");
      valid = false;
    } else if (!/^[0-9]{7,15}$/.test(tel)) {
      setError("telephone", "Ingresa un número válido (7–15 dígitos).");
      valid = false;
    }

    // Dirección
    if (!inputAddress.value.trim()) {
      setError("address", "La dirección es obligatoria.");
      valid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputEmail.value.trim()) {
      setError("email", "El correo electrónico es obligatorio.");
      valid = false;
    } else if (!emailRegex.test(inputEmail.value.trim())) {
      setError("email", "Ingresa un correo válido (ejemplo@dominio.com).");
      valid = false;
    }

    // Contraseña
    if (!inputPassword.value) {
      setError("password", "La contraseña es obligatoria.");
      valid = false;
    } else if (inputPassword.value.length < 8) {
      setError("password", "La contraseña debe tener al menos 8 caracteres.");
      valid = false;
    } else if (getStrength(inputPassword.value) < 2) {
      setError("password", "La contraseña es muy débil. Agrega mayúsculas, números o símbolos.");
      valid = false;
    }

    // Confirmar contraseña
    if (!validateConfirm()) valid = false;

    // Términos
    if (!checkTerms.checked) {
      setError("terms", "Debes aceptar los términos y condiciones.");
      valid = false;
    }

    return valid;
  }

  // ── Toast ────────────────────────────────────
  function showToast(msg = "¡Usuario registrado con éxito!") {
    toast.innerHTML = `<i class="fas fa-check-circle toast-icon"></i> ${msg}`;
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 400);
    }, 3000);
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

  // ── Guardar en localStorage ──────────────────
  function saveUsuario() {
    const data = {
      nombre        : inputFullname.value.trim(),
      apellido      : inputLastname.value.trim(),
      tipoDocumento : selectDocType.value,
      numeroDocumento: inputDocNumber.value.trim(),
      telefono      : inputTelephone.value.trim(),
      direccion     : inputAddress.value.trim(),
      email         : inputEmail.value.trim(),
      // ⚠️ Nunca guardar contraseñas en texto plano en producción
      timestamp     : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_usuario", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const data = saveUsuario();
      console.log("Usuario registrado:", data);

      showToast(`¡Bienvenido, ${data.nombre}! Tu cuenta fue creada.`);

      setTimeout(() => {
        window.location.href = "/ASSETS/inventario.html";
      }, 1500);
    }, 900);
  });

});