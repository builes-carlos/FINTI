/* ============================================================
   FINTI — Lógica compartida
   ============================================================ */

/* ---- Formato de números ---- */
function formatCOP(valor) {
  if (valor <= 0) return '$0';
  return '$' + Math.round(valor).toLocaleString('es-CO');
}

/* ---- Validación NIT colombiano ---- */
function validarNIT(nit) {
  const limpio = nit.toString().replace(/[\s.\-]/g, '');
  if (!/^\d{8,11}$/.test(limpio)) return false;

  const partes  = limpio.split('');
  const dv      = parseInt(partes.pop());
  const numero  = partes.join('');

  if (numero.length < 7 || numero.length > 9) return false;

  const primos  = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const digitos = numero.padStart(15, '0').split('').map(Number);

  let suma = 0;
  for (let i = 0; i < 15; i++) suma += digitos[i] * primos[i];

  const residuo    = suma % 11;
  const dvCalculado = residuo > 1 ? 11 - residuo : residuo;

  return dv === dvCalculado;
}

/* ---- Validación email corporativo ---- */
const DOMINIOS_PERSONALES = ['gmail', 'hotmail', 'yahoo', 'outlook', 'icloud', 'live', 'me', 'protonmail'];

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return { ok: false, msg: 'Formato de email inválido' };

  const dominio = email.split('@')[1].toLowerCase().split('.')[0];
  if (DOMINIOS_PERSONALES.includes(dominio)) {
    return { ok: false, msg: 'Ingresa tu email corporativo (no Gmail, Hotmail, etc.)' };
  }
  return { ok: true };
}

/* ---- Validación WhatsApp colombiano ---- */
function validarWhatsApp(tel) {
  const limpio = tel.replace(/\D/g, '');
  if (limpio.length !== 10) return { ok: false, msg: 'Debe tener 10 dígitos' };
  if (limpio[0] !== '3')    return { ok: false, msg: 'Debe empezar por 3 (celular colombiano)' };
  return { ok: true };
}

/* ---- Gestión de leads en localStorage ---- */
function guardarLead(lead) {
  const leads = JSON.parse(localStorage.getItem('finti_leads') || '[]');
  lead.timestamp = new Date().toISOString();
  lead.id        = `lead_${Date.now()}`;
  leads.push(lead);
  localStorage.setItem('finti_leads', JSON.stringify(leads));
  return lead.id;
}

function exportarLeads() {
  const leads = JSON.parse(localStorage.getItem('finti_leads') || '[]');
  if (!leads.length) return;

  const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `finti_leads_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function contarLeads() {
  return JSON.parse(localStorage.getItem('finti_leads') || '[]').length;
}

/* ---- Cálculos del simulador ---- */
function calcularSimulador() {
  const el = {
    slider:    document.getElementById('sim-slider'),
    numInput:  document.getElementById('sim-valor-input'),
    display:   document.getElementById('sim-valor-display'),
    neto:      document.getElementById('sim-neto'),
    costo:     document.getElementById('sim-costo'),
    tea:       document.getElementById('sim-tea'),
    opCosto:   document.getElementById('sim-oportunidad'),
    opDesc:    document.getElementById('sim-oportunidad-desc'),
  };
  if (!el.slider) return;

  const valor = parseFloat(el.slider.value) || 0;
  const dias  = parseInt(document.querySelector('.dias-option.active')?.dataset.dias) || 30;
  const tasa  = 0.018; // 1.8% mensual fijo

  const tasaDiaria = tasa / 30;
  const descuento  = valor * tasaDiaria * dias;
  const comision   = 25_000;
  const neto       = Math.max(0, valor - descuento - comision);
  const costoTotal = descuento + comision;
  const tea        = (Math.pow(1 + tasa, 12) - 1) * 100;

  // Costo de oportunidad mensual (suponiendo que es su volumen mensual de facturación)
  const costoMensual = valor * tasa;

  if (el.neto)    el.neto.textContent    = formatCOP(neto);
  if (el.costo)   el.costo.textContent   = formatCOP(costoTotal);
  if (el.tea)     el.tea.textContent     = tea.toFixed(1) + '% E.A.';
  if (el.opCosto) el.opCosto.textContent = formatCOP(costoMensual);
  if (el.opDesc)  el.opDesc.textContent  =
    `Cada mes que esperas cobrar facturas por ${formatCOP(valor)}, ` +
    `dejas de usar ${formatCOP(costoMensual)} en liquidez.`;

  // Actualizar barra del slider
  const max  = parseFloat(el.slider.max) || 500_000_000;
  const min  = parseFloat(el.slider.min) || 1_000_000;
  const prog = ((valor - min) / (max - min)) * 100;
  el.slider.style.setProperty('--prog', prog + '%');
  el.slider.style.background =
    `linear-gradient(90deg, var(--primary) ${prog}%, var(--border) ${prog}%)`;
}

/* ---- Contador animado ---- */
function animarContador(el, targetStr, duracion = 2200) {
  // Parsear el target: puede tener prefijos/sufijos (ej: "$8.200M", "347", "<2h")
  const prefijo  = el.dataset.prefix  || '';
  const sufijo   = el.dataset.suffix  || '';
  const target   = parseFloat(targetStr.replace(/[^0-9.]/g, '')) || 0;
  const esDecimal = targetStr.includes('.');
  const startTime = performance.now();

  function actualizar(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duracion, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
    const current  = eased * target;

    const formatted = esDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString('es-CO');

    el.textContent = prefijo + formatted + sufijo;
    if (progress < 1) requestAnimationFrame(actualizar);
  }

  requestAnimationFrame(actualizar);
}

/* ---- Animaciones al hacer scroll ---- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

/* Observador para contadores: dispara la animación al hacer scroll */
function initContadores() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContador(entry.target, entry.target.dataset.counter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => {
    el.textContent = '0';
    observer.observe(el);
  });
}

/* ---- Navegación lateral (dots) ---- */
function initSideNav() {
  const secciones = document.querySelectorAll('.section[id]');
  const dots      = document.querySelectorAll('.side-dot');
  if (!dots.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id  = entry.target.id;
        const dot = document.querySelector(`.side-dot[data-section="${id}"]`);
        dots.forEach(d => d.classList.remove('active'));
        if (dot) dot.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  secciones.forEach(s => observer.observe(s));

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ---- Navbar scroll ---- */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ---- Hamburger / menú móvil ---- */
function initMobileMenu() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Animación de días en tarjeta factura ---- */
function initFacturaAnim() {
  const diasEl    = document.getElementById('dias-anim');
  const perdidoEl = document.getElementById('perdido-anim');
  if (!diasEl) return;

  const TASA_DIARIA = 0.018 / 30;
  const VALOR       = 18_000_000;
  let diasActuales  = 0;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const interval = setInterval(() => {
        diasActuales++;
        if (diasEl) diasEl.textContent = diasActuales;
        if (perdidoEl) {
          const perdido = VALOR * TASA_DIARIA * diasActuales;
          perdidoEl.textContent = formatCOP(perdido);
        }
        if (diasActuales >= 68) clearInterval(interval);
      }, 40);
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  const factura = document.querySelector('.factura-wrapper');
  if (factura) observer.observe(factura);
}

/* ---- Formulario multistep ---- */
let pasoActual = 1;

function mostrarPaso(paso) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.add('hidden'));
  const stepEl = document.getElementById(`form-step-${paso}`);
  if (stepEl) stepEl.classList.remove('hidden');

  // Actualizar barra de progreso
  document.querySelectorAll('.progress-step').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 < paso)  el.classList.add('done');
    if (i + 1 === paso) el.classList.add('active');
  });
  document.querySelectorAll('.progress-line').forEach((el, i) => {
    el.classList.toggle('done', i + 1 < paso);
  });

  pasoActual = paso;
}

function mostrarError(inputId, msg) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`error-${inputId}`);
  if (input) input.classList.add('error');
  if (error) { error.textContent = msg; error.classList.add('show'); }
}

function limpiarError(inputId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`error-${inputId}`);
  if (input) input.classList.remove('error');
  if (error) error.classList.remove('show');
}

function validarPaso1() {
  let ok = true;

  const razon = document.getElementById('razon-social')?.value.trim();
  limpiarError('razon-social');
  if (!razon) { mostrarError('razon-social', 'Campo requerido'); ok = false; }

  const nit = document.getElementById('nit')?.value.trim();
  limpiarError('nit');
  if (!nit) {
    mostrarError('nit', 'Campo requerido'); ok = false;
  } else if (!validarNIT(nit)) {
    mostrarError('nit', 'NIT inválido — verifica el dígito de verificación'); ok = false;
  }

  const email = document.getElementById('email')?.value.trim();
  limpiarError('email');
  if (!email) {
    mostrarError('email', 'Campo requerido'); ok = false;
  } else {
    const res = validarEmail(email);
    if (!res.ok) { mostrarError('email', res.msg); ok = false; }
  }

  const wa = document.getElementById('whatsapp')?.value.trim();
  limpiarError('whatsapp');
  if (!wa) {
    mostrarError('whatsapp', 'Campo requerido'); ok = false;
  } else {
    const res = validarWhatsApp(wa);
    if (!res.ok) { mostrarError('whatsapp', res.msg); ok = false; }
  }

  return ok;
}

function validarPaso2() {
  let ok = true;
  ['volumen', 'plazo', 'ciudad', 'sector'].forEach(id => {
    const val = document.getElementById(id)?.value?.trim();
    limpiarError(id);
    if (!val) { mostrarError(id, 'Campo requerido'); ok = false; }
  });
  return ok;
}

function submitFormulario(e) {
  if (e) e.preventDefault();
  if (!validarPaso2()) return;

  const lead = {
    razonSocial: document.getElementById('razon-social')?.value.trim(),
    nit:         document.getElementById('nit')?.value.trim(),
    email:       document.getElementById('email')?.value.trim(),
    whatsapp:    document.getElementById('whatsapp')?.value.trim(),
    volumen:     document.getElementById('volumen')?.value.trim(),
    plazo:       document.getElementById('plazo')?.value.trim(),
    ciudad:      document.getElementById('ciudad')?.value.trim(),
    sector:      document.getElementById('sector')?.value.trim(),
  };

  guardarLead(lead);
  actualizarContadoresLeads();
  mostrarConfirmacion();
}

function mostrarConfirmacion() {
  const formCard    = document.querySelector('.form-card');
  const successCard = document.querySelector('.form-success');
  const progress    = document.querySelector('.form-progress');
  const exportBtn   = document.getElementById('export-btn');

  if (formCard)    formCard.classList.add('hidden');
  if (progress)    progress.classList.add('hidden');
  if (successCard) successCard.classList.add('show');
  if (exportBtn && contarLeads() >= 1) exportBtn.classList.remove('hidden');
}

/* ---- Simulador: sincronizar slider e input numérico ---- */
function initSimulador() {
  const slider   = document.getElementById('sim-slider');
  const numInput = document.getElementById('sim-valor-input');
  const display  = document.getElementById('sim-valor-display');
  if (!slider) return;

  function sincronizar(valor) {
    const v = Math.min(Math.max(parseFloat(valor) || 0, 1_000_000), 500_000_000);
    slider.value   = v;
    if (numInput) numInput.value = Math.round(v).toLocaleString('es-CO');
    if (display)  display.textContent = formatCOP(v);
    calcularSimulador();
  }

  slider.addEventListener('input', () => sincronizar(slider.value));

  if (numInput) {
    numInput.addEventListener('input', () => {
      const raw = numInput.value.replace(/\D/g, '');
      sincronizar(parseFloat(raw) || 0);
    });
  }

  // Días
  document.querySelectorAll('.dias-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dias-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcularSimulador();
    });
  });

  sincronizar(50_000_000); // valor inicial: $50M
}

/* ---- Contador real de leads registrados ---- */
function actualizarContadoresLeads() {
  // Reservado para cuando haya elementos de conteo en la UI
}

/* ---- Inicialización compartida ---- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initContadores();
  initSideNav();
  initSimulador();
  initFacturaAnim();
  actualizarContadoresLeads();

  // Botón exportar
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) exportBtn.addEventListener('click', exportarLeads);

  // Mostrar export si ya hay leads
  if (contarLeads() >= 1 && exportBtn) exportBtn.classList.remove('hidden');

  // Form: botón siguiente paso 1
  const btnNext = document.getElementById('btn-next');
  if (btnNext) btnNext.addEventListener('click', () => {
    if (validarPaso1()) mostrarPaso(2);
  });

  // Form: botón volver
  const btnBack = document.getElementById('btn-back');
  if (btnBack) btnBack.addEventListener('click', () => mostrarPaso(1));

  // Form: submit
  const form = document.getElementById('lead-form');
  if (form) form.addEventListener('submit', submitFormulario);

  // Limpiar errores al escribir
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => limpiarError(input.id));
  });

  // Hero headline: word reveal (solo en elementos con data-word-reveal)
  const headline = document.querySelector('.hero-title[data-word-reveal]');
  if (headline) {
    const text  = headline.textContent;
    const words = text.trim().split(/\s+/);
    headline.innerHTML = words.map((w, i) =>
      `<span class="word" style="animation-delay:${0.1 + i * 0.08}s">${w}</span>`
    ).join(' ');
  }
});
