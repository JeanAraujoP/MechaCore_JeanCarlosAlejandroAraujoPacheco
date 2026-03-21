// ─────────────────────────────────────────────
//  MechaCore – Seguimiento Pedido  |  main.js
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Referencias al DOM ──────────────────────
  const form               = document.getElementById("registerForm");
  const inputGuia          = document.getElementById("numeroGuia");
  const inputTransportadora = document.getElementById("transportadora");
  const checkTerms         = document.getElementById("terms");
  const btnCalc            = document.querySelector(".btn-register");
  const btnText            = document.querySelector(".btn-text");

  // ── Transportadoras conocidas ────────────────
  const transportadoras = {
    "servientrega"  : { label: "Servientrega",   dias: [1, 3],  color: "#e74c3c", icon: "fa-truck" },
    "coordinadora"  : { label: "Coordinadora",   dias: [2, 4],  color: "#3498db", icon: "fa-truck" },
    "envia"         : { label: "Envía",           dias: [1, 2],  color: "#27ae60", icon: "fa-bolt"  },
    "deprisa"       : { label: "Deprisa",         dias: [1, 2],  color: "#9b59b6", icon: "fa-plane" },
    "interrapidisimo": { label: "Interrapidísimo", dias: [2, 5], color: "#e67e22", icon: "fa-truck" },
    "tcc"           : { label: "TCC",             dias: [2, 4],  color: "#1abc9c", icon: "fa-truck" },
    "fedex"         : { label: "FedEx",           dias: [3, 7],  color: "#f39c12", icon: "fa-truck" },
    "dhl"           : { label: "DHL",             dias: [3, 7],  color: "#f1c40f", icon: "fa-box"   },
  };

  // Estados posibles del pedido (simulados por número de guía)
  const estados = [
    { estado: "Pedido recibido",       icon: "fa-check-circle",     color: "#27ae60" },
    { estado: "En preparación",        icon: "fa-box-open",         color: "#3498db" },
    { estado: "Despachado",            icon: "fa-shipping-fast",    color: "#e67e22" },
    { estado: "En tránsito",           icon: "fa-truck",            color: "#9b59b6" },
    { estado: "En ciudad destino",     icon: "fa-city",             color: "#1abc9c" },
    { estado: "En reparto",            icon: "fa-motorcycle",       color: "#e74c3c" },
    { estado: "Entregado",             icon: "fa-home",             color: "#27ae60" },
  ];

  // ── Panel de resultado (se crea una vez) ─────
  const resultPanel = document.createElement("div");
  resultPanel.id = "resultPanel";
  resultPanel.style.cssText =
    "display:none;margin-top:16px;border-radius:10px;overflow:hidden;" +
    "border:1px solid #e0e0e0;font-size:.85rem;";
  form.appendChild(resultPanel);

  // ── Auto-completar transportadora ────────────
  inputTransportadora.addEventListener("input", () => {
    const val = inputTransportadora.value.trim().toLowerCase();
    clearError(inputTransportadora);

    // Sugerir nombre oficial si coincide
    const match = Object.values(transportadoras).find(t =>
      t.label.toLowerCase().includes(val) || val.includes(t.label.toLowerCase().replace(/í/g, "i"))
    );
    inputTransportadora.style.borderColor = match ? "#27ae60" : "";
  });

  inputGuia.addEventListener("input", () => clearError(inputGuia));
  checkTerms.addEventListener("change", () => clearError(checkTerms));

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

  // ── Formato de fecha ─────────────────────────
  function formatFecha(date) {
    return date.toLocaleDateString("es-CO", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  }

  function addDias(date, dias) {
    const result = new Date(date);
    result.setDate(result.getDate() + dias);
    return result;
  }

  // ── Determinar estado por guía (simulado) ────
  function getEstadoSimulado(guia) {
    // Usar suma de char codes para asignar estado determinista
    const sum = [...guia].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return estados[sum % estados.length];
  }

  // ── Buscar transportadora por texto ──────────
  function findTransportadora(texto) {
    const lower = texto.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quitar tildes
    return Object.values(transportadoras).find(t => {
      const label = t.label.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return label.includes(lower) || lower.includes(label);
    }) ?? null;
  }

  // ── Render de resultado ──────────────────────
  function renderResultado(guia, transportInfo, estadoInfo) {
    const hoy        = new Date();
    const minDias    = transportInfo?.dias[0] ?? 3;
    const maxDias    = transportInfo?.dias[1] ?? 7;
    const fechaMin   = formatFecha(addDias(hoy, minDias));
    const fechaMax   = formatFecha(addDias(hoy, maxDias));
    const transColor = transportInfo?.color ?? "#888";
    const transLabel = transportInfo?.label ?? inputTransportadora.value.trim();
    const transIcon  = transportInfo?.icon  ?? "fa-truck";

    // Barra de progreso según estado
    const estadoIdx  = estados.indexOf(estadoInfo);
    const progreso   = Math.round(((estadoIdx + 1) / estados.length) * 100);

    // Timeline de estados
    const timelineHTML = estados.map((e, i) => {
      const activo   = i <= estadoIdx;
      const actual   = i === estadoIdx;
      const color    = activo ? e.color : "#ccc";
      const fontW    = actual ? "700" : "400";
      return `
        <div style="display:flex;align-items:center;gap:10px;padding:6px 0;
                    border-left:2px solid ${color};padding-left:12px;
                    margin-left:8px;${actual ? `background:${e.color}10;border-radius:4px` : ""}">
          <i class="fas ${e.icon}" style="color:${color};width:16px;text-align:center"></i>
          <span style="color:${activo ? "#333" : "#aaa"};font-weight:${fontW};font-size:.82rem">
            ${e.estado}${actual ? ' <span style="background:'+e.color+';color:#fff;font-size:.7rem;padding:1px 6px;border-radius:10px;margin-left:4px">Actual</span>' : ""}
          </span>
        </div>`;
    }).join("");

    resultPanel.style.display = "block";
    resultPanel.innerHTML = `
      <!-- Encabezado -->
      <div style="background:${transColor};color:#fff;padding:14px 16px;
                  display:flex;align-items:center;gap:10px">
        <i class="fas ${transIcon}" style="font-size:1.3rem"></i>
        <div>
          <strong style="font-size:.95rem">${transLabel}</strong><br>
          <span style="font-size:.78rem;opacity:.9">Guía: ${guia}</span>
        </div>
      </div>

      <!-- Estado actual -->
      <div style="padding:14px 16px;background:#fff">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <i class="fas ${estadoInfo.icon}" style="color:${estadoInfo.color};font-size:1.1rem"></i>
          <span style="font-weight:700;color:${estadoInfo.color}">${estadoInfo.estado}</span>
        </div>

        <!-- Barra de progreso -->
        <div style="background:#eee;border-radius:10px;height:6px;margin-bottom:6px">
          <div style="background:${estadoInfo.color};width:${progreso}%;height:6px;
                      border-radius:10px;transition:width .5s"></div>
        </div>
        <p style="color:#888;font-size:.75rem;margin-bottom:14px">${progreso}% completado</p>

        <!-- Entrega estimada -->
        <div style="background:#f8f9fa;border-radius:8px;padding:10px 12px;margin-bottom:14px">
          <p style="font-weight:700;color:#2c3e50;margin-bottom:4px">
            <i class="fas fa-calendar-check" style="color:${transColor}"></i> Entrega estimada
          </p>
          <p style="color:#555;font-size:.8rem">
            Entre <strong>${fechaMin}</strong><br>y <strong>${fechaMax}</strong>
          </p>
          <p style="color:#888;font-size:.75rem;margin-top:4px">
            (${minDias}–${maxDias} días hábiles desde hoy)
          </p>
        </div>

        <!-- Timeline -->
        <p style="font-weight:700;color:#2c3e50;margin-bottom:8px">
          <i class="fas fa-list-ul"></i> Historial de estados
        </p>
        <div>${timelineHTML}</div>
      </div>

      <!-- Pie -->
      <div style="background:#f0f0f0;padding:10px 16px;font-size:.78rem;color:#888;
                  display:flex;justify-content:space-between;align-items:center">
        <span><i class="fas fa-sync-alt"></i> Última actualización: ${new Date().toLocaleTimeString("es-CO")}</span>
        <span style="color:${transColor};font-weight:600;cursor:pointer"
              onclick="calcularTotal()">↻ Actualizar</span>
      </div>
    `;

    // Scroll suave al resultado
    resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ── Validación ───────────────────────────────
  function validateForm() {
    let valid = true;

    const guia = inputGuia.value.trim();
    if (!guia) {
      setError(inputGuia, "El número de guía es obligatorio.");
      valid = false;
    } else if (guia.length < 4) {
      setError(inputGuia, "El número de guía debe tener al menos 4 caracteres.");
      valid = false;
    }

    if (!inputTransportadora.value.trim()) {
      setError(inputTransportadora, "La transportadora es obligatoria.");
      valid = false;
    }

    if (!checkTerms.checked) {
      setError(checkTerms, "Debes aceptar los términos y condiciones.");
      valid = false;
    }

    return valid;
  }

  // ── calcularTotal (onclick del botón) ────────
  function calcularTotal() {
    if (!validateForm()) return;

    btnCalc.disabled     = true;
    btnText.textContent  = "Buscando...";

    setTimeout(() => {
      const guia          = inputGuia.value.trim();
      const transTexto    = inputTransportadora.value.trim();
      const transportInfo = findTransportadora(transTexto);
      const estadoInfo    = getEstadoSimulado(guia);

      // Guardar en localStorage
      const data = {
        numeroGuia     : guia,
        transportadora : transTexto,
        transportLabel : transportInfo?.label ?? transTexto,
        estadoActual   : estadoInfo.estado,
        timestamp      : new Date().toISOString(),
      };
      localStorage.setItem("mechacore_seguimiento", JSON.stringify(data));
      console.log("Seguimiento guardado:", data);

      renderResultado(guia, transportInfo, estadoInfo);

      btnCalc.disabled    = false;
      btnText.textContent = "Calcular";
    }, 1000);
  }

  // Exponer globalmente (el HTML usa onclick="calcularTotal()")
  window.calcularTotal = calcularTotal;

  // ── Submit como fallback ─────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    calcularTotal();
  });

  // ── Pre-cargar datos si vienen del pedido ────
  try {
    const pedido = JSON.parse(localStorage.getItem("mechacore_cabeza_pedido") || "{}");
    if (pedido.numeroPedido && !inputGuia.value) {
      inputGuia.value = `GU-${pedido.numeroPedido}`;
    }
  } catch (_) {}

});