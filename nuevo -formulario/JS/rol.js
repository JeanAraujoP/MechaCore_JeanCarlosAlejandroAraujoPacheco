// ─────────────────────────────────────────────
//  MechaCore – Rol (Crear Cuenta)  |  script.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form        = document.getElementById("registerForm");
  const selectRol   = document.getElementById("role");
  const roleError   = document.getElementById("roleError");
  const checkTerms  = document.getElementById("terms");
  const termsError  = document.getElementById("termsError");
  const btnRegister = document.querySelector(".btn-register");
  const btnText     = document.querySelector(".btn-text");
  const spinner     = document.querySelector(".spinner");
  const toast       = document.getElementById("toast");

  // ── Info por rol ─────────────────────────────
  const infoRoles = {
    proveedor: {
      icon   : "fa-store",
      color  : "#e67e22",
      titulo : "Proveedor",
      detalle: "Puedes publicar productos, gestionar inventario y recibir pedidos.",
      permisos: ["Gestionar productos", "Ver pedidos recibidos", "Administrar inventario", "Emitir facturas"],
    },
    usuario: {
      icon   : "fa-user",
      color  : "#3498db",
      titulo : "Usuario",
      detalle: "Puedes explorar el catálogo, realizar compras y hacer seguimiento de tus pedidos.",
      permisos: ["Explorar catálogo", "Realizar compras", "Seguimiento de pedidos", "Gestionar perfil"],
    },
  };

  // ── Panel informativo de rol ─────────────────
  const infoPanel = document.createElement("div");
  infoPanel.style.cssText =
    "display:none;padding:12px 14px;border-radius:8px;" +
    "margin-top:8px;font-size:.83rem;";
  selectRol.closest(".form-group").appendChild(infoPanel);

  selectRol.addEventListener("change", () => {
    const info = infoRoles[selectRol.value];
    roleError.textContent        = "";
    selectRol.style.borderColor  = "";

    if (!info) { infoPanel.style.display = "none"; return; }

    const permisosHTML = info.permisos
      .map(p => `<li style="margin:2px 0"><i class="fas fa-check" style="margin-right:5px"></i>${p}</li>`)
      .join("");

    infoPanel.style.display    = "block";
    infoPanel.style.background = info.color + "12";
    infoPanel.style.borderLeft = `4px solid ${info.color}`;
    infoPanel.style.color      = info.color;
    infoPanel.innerHTML =
      `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">` +
      `<i class="fas ${info.icon}" style="font-size:1.2rem"></i>` +
      `<strong style="font-size:.9rem">${info.titulo}</strong></div>` +
      `<p style="color:#555;font-size:.78rem;margin-bottom:8px">${info.detalle}</p>` +
      `<ul style="list-style:none;padding:0;margin:0;color:#555;font-size:.78rem">${permisosHTML}</ul>`;
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

    if (!selectRol.value) {
      roleError.textContent    = "Selecciona un rol.";
      roleError.style.color    = "#e74c3c";
      roleError.style.fontSize = ".75rem";
      selectRol.style.borderColor = "#e74c3c";
      valid = false;
    }

    if (!checkTerms.checked) {
      termsError.textContent    = "Debes aceptar los términos y condiciones.";
      termsError.style.color    = "#e74c3c";
      termsError.style.fontSize = ".75rem";
      valid = false;
    }

    return valid;
  }

  // ── Guardar en localStorage ──────────────────
  function saveRol() {
    const val  = selectRol.value;
    const info = infoRoles[val];

    // Combinar con datos de usuario si existen
    const usuarioData = JSON.parse(localStorage.getItem("mechacore_usuario") || "{}");

    const data = {
      rol       : val,
      rolLabel  : info?.titulo ?? val,
      permisos  : info?.permisos ?? [],
      usuario   : usuarioData.nombre ?? "",
      email     : usuarioData.email  ?? "",
      timestamp : new Date().toISOString(),
    };
    localStorage.setItem("mechacore_rol", JSON.stringify(data));
    return data;
  }

  // ── Submit ────────────────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const data = saveRol();
      console.log("Rol guardado:", data);

      const nombre = data.usuario ? `, ${data.usuario}` : "";
      showToast(`¡Cuenta creada${nombre}! Rol: ${data.rolLabel}`);

      setTimeout(() => {
        window.location.href = "/ASSETS/SeguimientoPedido.html";
      }, 1500);
    }, 900);
  });

});