# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`index.html` is a single self-contained HTML file: a personal work-execution dashboard ("Painel Pessoal — Norte Rios") for tracking weekly/monthly/quarterly deliverables, a PDI (individual development plan), a delivery map, indicators, and a ranking of work fronts. There is no build step, no package manager, no dependencies to install — it's one file with inline `<style>` and `<script>` blocks, vanilla JS/DOM (no framework), rendered by hand-written `render*()` functions that write `innerHTML` into `<section class="panel" id="panel-*">` targets.

`login.html` is a second, much smaller standalone HTML file: an email-only login gate in front of `index.html` (see "Login gate" below).

There is no test suite, linter, or build tooling in this repo. To "run" the app, just open the HTML file in a browser (or use the `run` skill, which will look for how to launch it).

## Architecture

**Single file, two coupled halves:**
- A large inline CSS block (top) defining a light/dark themed design system via CSS custom properties on `:root` (with `@media (prefers-color-scheme: dark)` and a `:root[data-theme="dark"]` override for explicit toggling).
- A single `<script>` block (bottom) containing all app logic, roughly in this order: icon SVG defs → static domain data constants → state shape/persistence → render helpers → per-tab render functions → `init()`.

**Static domain data** (top of the script, all `const`, all in Portuguese) drives the UI — this is where real-world content (schedules, deliverables, dates) lives, not in the DOM:
- `WEEK` — the fixed weekly time-blocked schedule (Mon–Fri).
- `ENCONTROS_GESTORES` / `SEMINARIO_GESTORES` / `TODOS_ENCONTROS_GESTORES` — a calendar of manager meetings with real dates, used to compute "next meeting" / "this week" / "past" via `parseISO`/`isPastEncontro`/`isTodayEncontro`/`isThisWeekEncontro`.
- `FRENTES`, `MESES`, `BIMESTRE`, `TRIMESTRE`, `EIXOS`/`EIXOS_MEDIA` — work fronts and their breakdown across month/bimester/trimester and axes.
- `MAPA` — the delivery map (rows shown in the "Mapa de entregas" tab).
- `STATUS_OPTS`, `PDI_CURSO_OPTS` — dropdown option sets.

**Tabs**: the `TABS` array is the single source of truth for navigation (key, label, icon). `renderTabs()` builds the nav from it; `switchTab(key)` toggles `hidden` on the matching `#panel-<key>` section and sets `aria-selected`. Each tab has one `render<Name>()` function (`renderInicio`, `renderSemana`, `renderMes`, `renderBimestre`, `renderTrimestre`, `renderPDI`, `renderMapa`, `renderIndicadores`, `renderRanking`) that re-renders its panel from `state` + the static domain data. `renderAll()` calls all of them; `init()` loads state, renders everything, and activates the "inicio" tab.

**State and persistence** — this is the part most likely to trip you up:
- `state` is a single mutable object (shape defined by `defaultState()`: `checks`, `pdiCursoAtual`, `pdiPercent`, `prioridades`, `pendencias`, `observacoes`, `entregaStatus`, `mesAtivo`, `edits`).
- Free-text fields and inline-editable content use a generic `ed(key, fallback)` / `edHtml(...)` + `setupEditableDelegation()` mechanism keyed into `state.edits`, rather than one state field per editable spot.
- On every mutation, `scheduleSave()` runs: it (a) shows the "Alterações salvas" indicator, (b) writes `state` to `localStorage` under `LS_KEY = 'nr_painel_state_v1'` immediately, and (c) debounced 700ms, tries `window.claude.use('artifact')` and calls `artifact.publish(buildFullDocument(state))` — i.e. when running as a published Claude Artifact, the page **republishes a brand-new version of its own full HTML document** with the updated state embedded, so the next load starts from where the user left off. Outside that runtime (plain browser), only `localStorage` persists.
- `buildFullDocument(st)` reconstructs the entire document from `window.__NR_SHELL_TEMPLATE__` (a full copy of the shell HTML, stored as an escaped string literal so the file can regenerate itself) plus a fresh JSON state blob, via simple token replacement (`SHELL_TEMPLATE_TOKEN_9c1b`, `STATE_JSON_TOKEN_7f3a`) — not a templating engine. `sealScriptClose()` guards against `</script` breaking out of the embedded strings.
- `loadInitialState()` prefers embedded state (`#state-data` JSON script tag) when running inside the artifact runtime, and falls back to `localStorage` otherwise, merged onto `defaultState()` so new fields added to `defaultState()` don't break old saved state.

**Implication for edits**: because the shell template is a literal string copy of the document embedded inside itself, any change to the visible HTML/CSS/script must also be reflected in the `__NR_SHELL_TEMPLATE__` string (or regenerated) — the two are meant to stay in sync so self-republishing doesn't revert your changes. Check where `__NR_SHELL_TEMPLATE__` is assigned before hand-editing structural HTML/script content.

## Login gate

The site is deployed statically (no backend), so there's no real auth — `login.html` is a client-side email allowlist, meant only to stop casual/unauthorized access, not a security boundary (the allowlist is visible in the page source).

- `login.html` holds `ALLOWED_EMAILS` (a plain array of authorized email addresses — edit this to add/remove people) and `AUTH_LS_KEY = "nr_painel_auth_v1"`. On submit it lowercases/trims the entered email, checks membership, and on match writes `{email, ts}` to `localStorage[AUTH_LS_KEY]` before redirecting to `index.html`. If a valid session already exists, it redirects straight to `index.html` instead of showing the form.
- `index.html` has a tiny guard `<script>` as the very first thing inside `<body>` (before the visible header markup) that checks for that same `localStorage[AUTH_LS_KEY]` and does `location.replace("login.html")` if missing — this is what makes the gate actually enforced rather than decorative.
- `index.html`'s guard does **not** re-check the email against `ALLOWED_EMAILS` — it only checks that a session was recorded. So removing an email from `ALLOWED_EMAILS` does not revoke devices that already logged in (their `localStorage` still has a session). That's an accepted tradeoff for this lightweight client-side gate, not a bug.
- `login.html` intentionally does **not** reuse `index.html`'s base64 logo (`#logoImg`, set from a large embedded PNG in the main script) — it uses a plain text brand mark instead, to stay small. It does duplicate the relevant `:root` design tokens (colors, fonts, radius, shadow) so the two pages look consistent; if you restyle `index.html`'s palette, mirror the change here too since there's no shared CSS file between them.

## Working in this file

- Everything is in Portuguese (labels, domain data, comments where present) — match that when adding content.
- The file is large (~650KB, long minified-looking lines for the embedded shell template and any embedded image data URIs) — use `Grep` with line-length-limited patterns or narrow `Read` offsets rather than reading it in one shot; a couple of single lines are hundreds of KB and will blow a normal read budget.
- Colors/spacing/radii are all CSS custom properties on `:root` — reuse existing `--verde`/`--laranja`/`--teal`/`--amarelo`/`--vermelho` (+ `-suave` tints) rather than introducing new hardcoded colors, and remember each needs both a light value and a dark override.
- New tabs/panels follow the existing pattern: add an entry to `TABS`, a `<section class="panel" id="panel-<key>" hidden>` in the body, and a `render<Key>()` function wired into `renderAll()`.
