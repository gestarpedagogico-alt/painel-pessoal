# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal work-execution dashboard ("Painel Pessoal — Norte Rios") for tracking weekly/monthly/quarterly deliverables, a PDI (individual development plan), a delivery map, indicators, and a ranking of work fronts. It's a static site — no build step, no package manager, no dependencies to install beyond the Google Fonts stylesheet — split into HTML, CSS and vanilla-JS (ES modules) files.

`login.html` is a small standalone page: an email-only login gate in front of `index.html` (see "Login gate" below).

**Because the app JS is loaded as ES modules (`<script type="module">`), it must be served over http(s) — opening the HTML files directly from disk (`file://`) will not work; browsers block module imports under that protocol.** Serve the project root with any static file server (`python -m http.server`, `npx serve .`, the `run` skill, a Live Server extension, etc.) during development.

There is no test suite or linter in this repo.

## File layout

```
index.html                 shell markup for the dashboard, links css/js below
login.html                 shell markup for the login gate
supabase/
  schema.sql                 CREATE TABLE + RLS policies for every table (run first)
  seed.sql                   INSERTs transcribing the original static data + defaultState()
css/
  tokens.css                shared :root design tokens (colors, radii, fonts), light + dark
  app.css                   all index.html styles (everything except tokens)
  login.css                 all login.html styles (everything except tokens)
js/
  auth-guard.js              index.html's access guard (see "Login gate")
  login.js                   login.html's logic (ALLOWED_EMAILS, form handling)
  app/
    icons.js                  ICONS map + icon() helper (inline SVG paths)
    supabase-client.js         creates/exports the single Supabase client (paste project URL + anon key here)
    data.js                    pure per-item date helpers only (parseISO, isPastEncontro, isTodayEncontro, isThisWeekEncontro)
    data-service.js            loadCatalog(): fetches all catalog tables from Supabase into the same shapes data.js used to export (WEEK, TODOS_ENCONTROS_GESTORES, TRIMESTRE, MESES, BIMESTRE, EIXOS, EIXOS_MEDIA, MAPA, STATUS_OPTS, PDI_CURSO_OPTS, NATURE_CLASS) + proximoEncontroGestores()
    state.js                   state shape, defaultState(), loadInitialState() + per-field Supabase save functions (saveCheck, saveEntregaStatus, saveEdit, savePainelEstado, resetWeekChecks)
    render-helpers.js          esc/ed/edHtml/setupEditableDelegation/todayStr/mesAtualKey/...
    tabs.js                    TABS array, renderTabs(), switchTab()
    main.js                    renderAll() + init() (now async: awaits loadCatalog()+loadInitialState()), the module entry point
    views/
      inicio.js, semana.js, mes.js, bimestre.js, trimestre.js,
      pdi.js, mapa.js, indicadores.js, ranking.js
                                one render<Nome>() per tab, plus that tab's private helpers
assets/
  logo.png                   the header logo (previously a base64 data: URI inline in JS)
```

**Static domain data lives in Supabase, not in JS.** All real-world content (schedules, deliverables, dates — everything in Portuguese) that used to be hardcoded in `js/app/data.js` now lives in Postgres tables, defined in `supabase/schema.sql` and seeded in `supabase/seed.sql`. `js/app/data-service.js`'s `loadCatalog()` fetches every catalog table on startup and rebuilds the exact same in-memory shapes the old `data.js` used to export as `const`s, so views read them the same way as before, just imported from `data-service.js` instead:
- `WEEK` — the fixed weekly time-blocked schedule (Mon–Fri). Backed by `semana_dias` + `semana_blocos`.
- `ENCONTROS_GESTORES` / `SEMINARIO_GESTORES` / `TODOS_ENCONTROS_GESTORES` — a calendar of manager meetings with real dates, used to compute "next meeting" / "this week" / "past" via `parseISO`/`isPastEncontro`/`isTodayEncontro`/`isThisWeekEncontro` (these four pure per-item helpers are the only things still in `js/app/data.js`; `proximoEncontroGestores()` moved to `data-service.js` since it reads the loaded array). Backed by `encontros_gestores`.
- `TRIMESTRE` (the old `FRENTES` array was folded in as `TRIMESTRE`'s `obrigatorio` — the two arrays duplicated the same `n`/`nome`/`peso`, so they became one `frentes` table), `MESES`, `BIMESTRE`, `EIXOS`/`EIXOS_MEDIA` — work fronts and their breakdown across month/bimester/trimester and axes. Backed by `frentes`, `meses`, `bimestre_itens`, `eixos`/`eixos_cursos`/`eixos_media`.
- `MAPA` — the delivery map (rows shown in the "Mapa de entregas" tab). Backed by `mapa_entregas`.
- `STATUS_OPTS` — dropdown options, backed by `status_opts`. `PDI_CURSO_OPTS` stays a pure client-side projection (no table of its own): `data-service.js` rebuilds it from `eixos_cursos` filtered to `A,C,G,B`, same as the old IIFE in `data.js` did from `EIXOS`.

Catalog tables are seeded once and are **read-only from the app** — there is no UI anywhere to add/edit/delete a catalog row (the migration deliberately kept this 1:1 with the pre-Supabase app, which had no such UI either). If the real-world schedule/plan changes, edit it with SQL (or the Supabase Table Editor) directly, not through the app.

**Tabs**: `js/app/tabs.js`'s `TABS` array is the single source of truth for navigation (key, label, icon). `renderTabs()` builds the nav from it; `switchTab(key)` toggles `hidden` on the matching `#panel-<key>` section (declared in `index.html`) and sets `aria-selected`. Each tab has one `render<Name>()` function in its own file under `js/app/views/` (`renderInicio`, `renderSemana`, `renderMes`, `renderBimestre`, `renderTrimestre`, `renderPDI`, `renderMapa`, `renderIndicadores`, `renderRanking`) that re-renders its panel from `state` + the static domain data. `js/app/main.js`'s `renderAll()` calls all of them; `init()` loads state, renders everything, and activates the "inicio" tab.

**Module dependency notes**:
- `js/app/render-helpers.js` and `js/app/views/ranking.js` import from each other (helpers needs `renderRanking` for the inline-edit-triggers-re-render case; ranking needs `esc`). This is a valid ES module circular import because neither side uses the other's export at module-evaluation time, only inside function bodies invoked later — don't "fix" this by inlining, it's intentional.
- `js/app/views/ranking.js` imports `triText`/`triPeso` from `js/app/views/trimestre.js` rather than duplicating the peso/name-override lookup — the Trimestre and Ranking tabs share the same per-frente overrides stored in `state.edits`.
- `js/app/data.js` now holds only the four pure per-item date helpers (`parseISO`, `isPastEncontro`, `isTodayEncontro`, `isThisWeekEncontro`); every view still imports those straight from `data.js`. Everything else that used to be a `data.js` export (`WEEK`, `TODOS_ENCONTROS_GESTORES`, `TRIMESTRE`, `MESES`, `BIMESTRE`, `EIXOS`, `EIXOS_MEDIA`, `MAPA`, `STATUS_OPTS`, `PDI_CURSO_OPTS`, `NATURE_CLASS`, plus `proximoEncontroGestores()`) is now an `export let` in `js/app/data-service.js`, populated by `loadCatalog()` on startup — import those from `data-service.js`, not `data.js`.

**State and persistence — now backed by Supabase, dataset is single and shared (not per-user)**:
- `state` is still a single mutable object with the same shape (`defaultState()` in `js/app/state.js`: `checks`, `pdiCursoAtual`, `pdiPercent`, `prioridades`, `pendencias`, `observacoes`, `entregaStatus`, `mesAtivo`, `edits`) and still a live-binding ES module export (`export let state`) that other modules `import { state } from '.../state.js'` and mutate directly. What changed is where it's persisted: `loadInitialState()` (now `async`) fetches `painel_estado` (singleton row, id=1), `checks`, `entrega_status` and `edits` from Supabase instead of reading `localStorage`.
- There is **no per-user data** — the login gate (`login.html`/`js/auth-guard.js`) is unchanged, still a client-side email allowlist, not real auth; every allowed email shares the same Supabase rows. RLS is enabled on every table with permissive policies for the `anon` key (catalog: select-only; state: select/insert/update/delete) — the same "not a real security boundary" tradeoff already accepted for the login gate, just extended to the database.
- The old generic `scheduleSave()` (write the whole `state` blob to `localStorage`) is gone. In its place, `state.js` exports one function per kind of write, called at the exact same call sites the old `scheduleSave()` calls used to be: `saveCheck(id, marcado)` and `resetWeekChecks(ids)` (upsert/delete on `checks`), `saveEntregaStatus(mapaId, status)` (upsert on `entrega_status`), `saveEdit(chave, valor)` (upsert on `edits`, called from `setupEditableDelegation()` in `render-helpers.js`), and `savePainelEstado(patch)` (update on the `painel_estado` singleton, used for `pdiCursoAtual`/`pdiPercent`/`prioridades`/`pendencias`/`observacoes`/`mesAtivo`). Each function mutates `state` locally first (optimistic, so the UI never waits on the network) and then awaits the Supabase write, logging (not throwing) on failure.
- Free-text fields and inline-editable content still use the generic `ed(key, fallback)` / `edHtml(...)` + `setupEditableDelegation()` mechanism (in `render-helpers.js`) keyed into `state.edits` — unchanged, just backed by the `edits` table instead of `localStorage` now.
- `js/app/main.js`'s `init()` is now `async`: it `await`s `loadCatalog()` (from `data-service.js`) and `loadInitialState()` together before the first `renderAll()`, showing a brief "Carregando dados do Supabase…" message in `#panel-inicio` while that's in flight.

**History**: this app used to be one big self-contained `index.html` that, when running inside a Claude Artifact runtime, republished a brand-new version of its own full HTML document on every state change (via an embedded copy of the whole shell template as a JS string, `window.__NR_SHELL_TEMPLATE__`, plus `buildFullDocument()`/`sealScriptClose()`). That mechanism required the entire app to be one literal file and was removed when the project was split into these modules — it's incompatible with separate CSS/JS files. If you ever see references to it in old commits, that's why; it does not need to be restored.

## Login gate

The site is deployed statically (no backend), so there's no real auth — `login.html` is a client-side email allowlist, meant only to stop casual/unauthorized access, not a security boundary (the allowlist is visible in the page source, in `js/login.js`).

- `js/login.js` holds `ALLOWED_EMAILS` (a plain array of authorized email addresses — edit this to add/remove people) and `AUTH_LS_KEY = "nr_painel_auth_v1"`. On submit it lowercases/trims the entered email, checks membership, and on match writes `{email, ts}` to `localStorage[AUTH_LS_KEY]` before redirecting to `index.html`. If a valid session already exists, it redirects straight to `index.html` instead of showing the form.
- `js/auth-guard.js` is loaded via a plain (non-module, non-deferred) `<script src="js/auth-guard.js">` as the very first thing inside `index.html`'s `<body>`, before the visible header markup — it must stay a classic synchronous script (not `type="module"`, which is deferred) so it can `location.replace("login.html")` before anything renders if there's no session. It checks for that same `localStorage[AUTH_LS_KEY]` — this is what makes the gate actually enforced rather than decorative.
- The guard does **not** re-check the email against `ALLOWED_EMAILS` — it only checks that a session was recorded. So removing an email from `ALLOWED_EMAILS` does not revoke devices that already logged in (their `localStorage` still has a session). That's an accepted tradeoff for this lightweight client-side gate, not a bug.
- Both pages link `css/tokens.css` for shared design tokens (colors, fonts, radius, shadow), so restyling the palette in one place (`css/tokens.css`) affects both pages automatically — no more manual duplication needed here.

## Working in this file

- Everything is in Portuguese (labels, domain data, comments where present) — match that when adding content.
- Colors/spacing/radii are all CSS custom properties from `css/tokens.css` — reuse existing `--verde`/`--laranja`/`--teal`/`--amarelo`/`--vermelho` (+ `-suave` tints) rather than introducing new hardcoded colors; they already have both light and dark values, defined once.
- New tabs/panels follow the existing pattern: add an entry to `TABS` in `js/app/tabs.js`, a `<section class="panel" id="panel-<key>" hidden>` in `index.html`'s body, a new `js/app/views/<key>.js` exporting `render<Key>()`, and wire that import into `renderAll()` in `js/app/main.js`.
- New shared UI logic goes in `render-helpers.js`; new domain data/constants go in Supabase (add a table/column in `supabase/schema.sql`, seed it in `supabase/seed.sql`, expose it from `js/app/data-service.js`'s `loadCatalog()`) rather than back into `data.js`, which is now only pure date helpers; keep view files limited to one tab's render function + that tab's private helpers.
- Need Supabase credentials to run this locally? Paste your project's URL and anon key into `js/app/supabase-client.js`, then run `supabase/schema.sql` followed by `supabase/seed.sql` in the Supabase SQL Editor once. There is no per-user data — every allowed email (see "Login gate" below) shares the same rows.
