# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Finti** is a Colombian fintech lead-capture teaser for a direct factoring operator. The deliverable is a single `index.html` with all CSS and JS embedded. No build step, no framework, no server required — the file must work via `file://` in a browser.

## Running / Developing

Open `index.html` directly in a browser. For a local server (optional, no hot-reload needed):

```bash
npx http-server . -p 3000
```

External dependencies (CDN only, no npm):
- Tailwind CSS CDN — for utility classes
- Google Fonts CDN — use a character-driven typeface (not Inter/Roboto)

## Architecture

Single file: `index.html`

```
<head>
  Tailwind CDN + Google Fonts CDN
  <style>  ← custom/branding CSS here (Tailwind utilities in HTML)

<body>
  1. Hero          — headline, social proof, primary CTA
  2. Cómo funciona — 3-step process
  3. Simulador     — real-time liquidity calculator
  4. Comparativa   — feature table vs competitors
  5. Formulario    — lead capture with localStorage persistence
  6. Footer

<script>  ← all JS here (no external libraries)
  validarNIT()      — Colombian tax ID check-digit validation
  guardarLead()     — save to localStorage key `finti_leads`
  exportarLeads()   — download leads as JSON file
  simulator logic   — real-time recalculation on input events
  form validation   — NIT, email domain blocklist, WhatsApp format
```

## Key Implementation Details

### Simulator formula
```
Tasa_diaria = 0.018 / 30
Descuento   = Valor_factura × Tasa_diaria × Días
Comisión    = 25000  // COP, fixed per operation
Valor_neto  = Valor_factura - Descuento - Comisión
```
Recalculates on every input change — no "Calcular" button.

### NIT validation (Colombian algorithm)
Primes used: `[3,7,13,17,19,23,29,37,41,43,47,53,59,67,71]`  
Base number: 7–9 digits. Pad to 15 digits, multiply each by corresponding prime, sum, mod 11.  
Check digit: `residue > 1 ? 11 - residue : residue`

### Lead persistence
`localStorage` key: `finti_leads` (JSON array).  
Each lead gets `timestamp` (ISO string) and `id` (`lead_${Date.now()}`).  
Export button (`exportarLeads()`) only appears when ≥1 lead is stored.

### Form validation rules
- **NIT**: must pass `validarNIT()` — 8–10 digit string including check digit
- **Email**: regex + block `gmail`, `hotmail`, `yahoo` — must be corporate domain
- **WhatsApp**: exactly 10 digits, first digit `3`
- All fields required before submit

## Design Constraints

- Palette: emerald green / deep black / amber gold accent (engineer may improve with justification)
- Aesthetic: "Fintech latinoamericano moderno" — warm, institutional trust, NOT Silicon Valley dark mode
- Copy tone: tuteado, direct, no jargon; avoid "ecosistema", "disruptivo", "empoderamiento"
- Comparison table icons: ✅ / ❌ / ⚠️ only
- All animations: pure CSS (no JS animation libraries)
- Mobile-first, minimum 375px viewport
- Do NOT use `<form action>` — handle submit entirely in JS

## Competitors shown in comparison table

| Competitor | Key weakness to surface |
|---|---|
| Klym | 24–48h, requires ERP integration, targets large corporates |
| Finaktiva | Complex suite, onboarding requires sales executive |
| Banco tradicional | Collateral requirements, days-to-weeks approval |

Finti advantages: <2h approval, 100% self-service, accepts mid-tier payers, no balance-sheet debt.
