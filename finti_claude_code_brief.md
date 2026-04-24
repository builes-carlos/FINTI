# BRIEF PARA CLAUDE CODE: Finti — Teaser de Captura de Leads

## ROL
Actúa como Senior Fintech Product Engineer + UI/UX Designer. Tienes criterio autónomo de arquitectura y diseño. No pidas permiso para cada decisión de implementación.

---

## CONTEXTO DEL NEGOCIO

**Startup:** Finti  
**País:** Colombia (2026)  
**Modelo:** Operador directo de factoring. Finti identifica las pymes, hace el estudio de crédito, compra las facturas y gestiona el cobro. NO es una plataforma tecnológica blanca; es el factor real.  
**Mercado objetivo:** Pymes colombianas con facturas por cobrar a 30/60/90 días, especialmente las desatendidas por banca tradicional y por jugadores como Klym (que apuntan a grandes corporativos) y Finaktiva (suite compleja para medianas empresas).

**Palanca tecnológica clave:** Integración con RADIAN (plataforma de la DIAN para registro y trazabilidad de facturas electrónicas como título valor). Esto permite verificar, endosar y operar facturas en tiempo real, sin papeleo.

---

## COMPETIDORES A CONTRASTAR (mostrar en la UI)

| Competidor | Debilidad visible |
|---|---|
| **Klym** | Apunta a grandes corporativos y sus ecosistemas de proveedores. Proceso de 24-48h. Requiere integración ERP. Pyme pequeña queda fuera. |
| **Finaktiva** | Suite compleja (crédito + factoring + SCF + gestión financiera). Orientado a empresa mediana-grande. Onboarding asistido por ejecutivos. |
| **Ibylit** | Vende tecnología a entidades financieras (white label). No opera directamente. La pyme debe ir a un banco que use Ibylit, no a Ibylit directamente. |
| **Banca tradicional** | Requisitos de garantías, colateral, historial. Aprobación en días o semanas. |

**Diferenciadores de Finti a comunicar:**
1. **Velocidad:** Aprobación en menos de 2 horas vía RADIAN — sin ejecutivos, sin fila.
2. **Autoservicio:** 100% digital. La pyme carga su XML de la DIAN o ingresa el número de factura. Finti hace el estudio.
3. **Foco en la pyme pequeña:** Finti acepta pagadores medianos que otros rechazan. No necesitas ser proveedor de Bavaria o Ecopetrol.
4. **Sin deuda:** El factoring no genera pasivo en el balance de la pyme.
5. **Transparencia:** Simulador público antes de registrarse.

---

## OBJETIVO DEL TEASER

Capturar leads calificados de pymes colombianas antes del lanzamiento oficial. La app es un **Early Access Waitlist** con:
- Hero section con propuesta de valor clara
- Tabla comparativa vs competidores
- Simulador de liquidez interactivo
- Formulario de captura de leads
- Persistencia local en JSON

---

## ESPECIFICACIONES TÉCNICAS

### Stack
- **Un solo archivo `index.html`** con CSS y JS embebidos (sin frameworks externos salvo Tailwind CDN y Google Fonts CDN)
- Sin backend por ahora. Los leads se guardan en `localStorage` y se pueden exportar como JSON descargable.
- Responsive (mobile-first — las pymes colombianas operan desde celular).

### Diseño
- Estética: **"Fintech latinoamericano moderno"** — NO el dark mode genérico de Silicon Valley. Buscar algo que combine:
  - Calor latinoamericano (tipografía con carácter, no Inter/Roboto genérico)
  - Confianza institucional (no debe verse como startup de garaje)
  - Urgencia y claridad (el empresario pyme debe entender en 5 segundos qué gana)
- Paleta sugerida: verde esmeralda / negro profundo / dorado ámbar como acento — pero el diseñador puede proponer algo mejor si tiene criterio fundado.
- Nombre: **Finti** — sin logo aún, usar logotipo tipográfico.

---

## SECCIONES DE LA APP (en orden)

### 1. HERO
- Logo tipográfico "Finti" + tagline
- **Headline principal:** *"Tu factura vale hoy, no en 60 días."*
- **Subheadline:** *"Liquidez inmediata vía RADIAN en menos de 2 horas. Sin ejecutivos. Sin filas. Sin deuda."*
- CTA primario: `"Quiero acceso anticipado"` → scroll al formulario
- Indicadores de prueba social (placeholder): *"200+ pymes en lista de espera"*, *"$5.000M en facturas pre-aprobadas"*

### 2. CÓMO FUNCIONA (3 pasos)
1. **Sube tu factura** — XML de la DIAN o número de factura electrónica
2. **Finti hace el estudio** — Verificamos en RADIAN y evaluamos al pagador, no a ti
3. **Recibe tu dinero** — Desembolso en menos de 2 horas

### 3. SIMULADOR DE LIQUIDEZ
Inputs del usuario:
- Valor de la factura (slider + input numérico, en pesos colombianos)
- Días para vencimiento: 30 / 60 / 90 (radio buttons o toggle)
- Tasa de descuento mensual: fija en 1.8% (mostrar como referencia, con nota "la tasa final depende del perfil del pagador")

**Fórmula:**
```
Tasa_diaria = tasa_mensual / 30
Descuento = Valor_factura × Tasa_diaria × Días
Comisión_fija = 25.000 COP (por operación)
Valor_neto = Valor_factura - Descuento - Comisión_fija
```

Output a mostrar:
- Valor neto que recibirías HOY
- Costo total de la operación
- Tasa efectiva anual equivalente
- Comparación visual: "vs esperar 60 días con riesgo de no cobrar"

CTA debajo del simulador: `"Calcular mi oferta real"` → scroll al formulario

### 4. TABLA COMPARATIVA
Título: *"¿Por qué Finti y no los demás?"*

Columnas: Finti / Klym / Finaktiva / Banco tradicional  
Filas a comparar:
- Tiempo de aprobación
- ¿Acepta pymes pequeñas?
- ¿Requiere ejecutivo comercial?
- ¿Necesita integración ERP?
- ¿Genera deuda en tu balance?
- ¿Acepta pagadores medianos?
- Proceso 100% digital

Usar ✅ / ❌ / ⚠️ con nota aclaratoria donde aplique.

### 5. FORMULARIO DE CAPTURA (Early Access)
Título: *"Únete a la lista de espera — los primeros 50 acceden con tasa preferencial"*

Campos a capturar:
- **Razón social** (texto, requerido)
- **NIT** (numérico con validación de dígito de verificación — algoritmo colombiano)
- **Email corporativo** (validar que no sea gmail/hotmail/yahoo — debe ser dominio propio)
- **WhatsApp del decisor** (formato colombiano: 10 dígitos, empieza en 3)
- **Volumen mensual de facturación** (select: `< $50M` / `$50M–$200M` / `$200M–$500M` / `> $500M`)
- **Plazo promedio de cobro** (select: `30 días` / `60 días` / `90 días` / `Más de 90 días`)
- **Ciudad** (texto, requerido)
- **Sector económico** (select: Construcción / Servicios / Manufactura / Agroindustria / Salud / Tecnología / Otro)

**Validaciones:**
- NIT colombiano: validar dígito de verificación con el algoritmo oficial (prima 3,7,13,17,19,23,29,37,41,43,47,53,59,67,71)
- Email: regex + bloqueo de dominios personales
- WhatsApp: exactamente 10 dígitos, primer dígito debe ser 3
- Todos los campos requeridos antes de enviar

**Al enviar:**
- Guardar en `localStorage` con key `finti_leads` como array JSON
- Mostrar mensaje de confirmación: *"¡Estás dentro! Te contactamos en las próximas 24 horas."*
- Botón secundario: `"Descargar leads (JSON)"` — solo visible si hay ≥1 lead guardado (para el founder)

### 6. FOOTER
- Texto legal mínimo: *"Finti opera como factor comercial en proceso de registro ante el Registro Nacional de Factores (Decreto 1068 de 2015)."*
- Links placeholder: Términos / Privacidad / Contacto
- *"© 2026 Finti SAS — Colombia"*

---

## ALGORITMO DE VALIDACIÓN NIT COLOMBIA

```javascript
function validarNIT(nit) {
  // Separar número del dígito de verificación
  const partes = nit.toString().replace(/\D/g, '').split('');
  if (partes.length < 2) return false;
  
  const dv = parseInt(partes.pop()); // último dígito
  const numero = partes.join('');
  
  if (numero.length < 7 || numero.length > 9) return false;
  
  const primos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const digitos = numero.padStart(15, '0').split('').map(Number);
  
  let suma = 0;
  for (let i = 0; i < 15; i++) {
    suma += digitos[i] * primos[i];
  }
  
  const residuo = suma % 11;
  const dvCalculado = residuo > 1 ? 11 - residuo : residuo;
  
  return dv === dvCalculado;
}
```

---

## PERSISTENCIA DE LEADS

```javascript
// Guardar lead
function guardarLead(lead) {
  const leads = JSON.parse(localStorage.getItem('finti_leads') || '[]');
  lead.timestamp = new Date().toISOString();
  lead.id = `lead_${Date.now()}`;
  leads.push(lead);
  localStorage.setItem('finti_leads', JSON.stringify(leads));
}

// Exportar como JSON descargable
function exportarLeads() {
  const leads = JSON.parse(localStorage.getItem('finti_leads') || '[]');
  const blob = new Blob([JSON.stringify(leads, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finti_leads_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}
```

---

## MICRO-COPY Y TONO

- Tuteado, directo, sin jerga financiera innecesaria
- El empresario pyme es inteligente pero ocupado — cada frase debe justificar su existencia
- Evitar: "solución integral", "ecosistema", "empoderamiento", "disruptivo"
- Usar: números concretos, tiempos específicos, beneficios tangibles
- Humor mínimo colombiano permitido — nada forzado

---

## NOTAS FINALES PARA CLAUDE CODE

1. El archivo debe funcionar abriéndolo directamente en el browser (file://) sin servidor.
2. Usar Tailwind CSS vía CDN para utilidades, pero el diseño distintivo va en `<style>` embebido.
3. Google Fonts vía CDN — elegir tipografía con carácter, no Inter.
4. Todas las animaciones en CSS puro (no depender de librerías JS de animación).
5. El simulador debe actualizarse en tiempo real con cada cambio del usuario (no requiere botón "calcular").
6. Mobile-first: el formulario y el simulador deben ser perfectamente usables en pantalla de 375px.
7. NO usar `<form>` con `action` — manejar submit con JavaScript.
8. Código limpio y comentado en español para facilitar iteraciones futuras.
