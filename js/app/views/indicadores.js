import { icon } from '../icons.js';
import { state } from '../state.js';
import { MAPA, STATUS_OPTS, TODOS_ENCONTROS_GESTORES, PDI_CURSO_OPTS } from '../data-service.js';
import { esc, pct } from '../render-helpers.js';

/* ============ INDICADORES ============ */
function statusCounts(){
  const counts = {};
  STATUS_OPTS.forEach(o=>counts[o.v]=0);
  MAPA.forEach(r=>{ const st = state.entregaStatus[r.id] || "afazer"; counts[st] = (counts[st]||0)+1; });
  return counts;
}
function encontrosConfirmados(){
  const total = TODOS_ENCONTROS_GESTORES.length;
  const done = TODOS_ENCONTROS_GESTORES.filter(it=>!!state.checks[it.id]).length;
  return {done, total};
}
export function renderIndicadores(){
  const el = document.getElementById("panel-indicadores");
  const counts = statusCounts();
  const totalMapa = MAPA.length;
  const enc = encontrosConfirmados();
  const encPct = pct(enc.done, enc.total);
  el.innerHTML = `
    <div class="panel-head"><p class="eyebrow">Indicadores</p><h2>Indicadores de acompanhamento</h2>
      <p class="panel-sub">Números tirados direto do Mapa de entregas, do PDI e dos encontros da Escola de Gestores. Pensado para a coordenação acompanhar o andamento.</p></div>
    <div class="grid stat-grid">
      ${STATUS_OPTS.map(o=>`<div class="stat-card st-card-${o.v}"><div class="stat-num">${counts[o.v]}</div><div class="stat-lbl">${esc(o.l)}</div></div>`).join("")}
    </div>
    <div class="card" style="margin-top:14px;">
      <h3>${icon("map")}Progresso das entregas do Mapa</h3>
      <div class="seg-bar">${STATUS_OPTS.map(o=>{
        const w = totalMapa ? (counts[o.v]/totalMapa*100) : 0;
        if(w<=0) return "";
        return `<div class="seg seg-${o.v}" style="width:${w}%;" title="${esc(o.l)}, ${counts[o.v]} de ${totalMapa}"></div>`;
      }).join("")}</div>
      <div class="seg-legend">${STATUS_OPTS.map(o=>`<span class="leg-item"><span class="leg-dot dot-${o.v}"></span>${esc(o.l)}, ${counts[o.v]} de ${totalMapa}</span>`).join("")}</div>
    </div>
    <div class="grid grid-2" style="margin-top:14px;">
      <div class="card">
        <h3>${icon("pdi")}Progresso do PDI</h3>
        <div class="row-between"><span style="font-size:13px;color:var(--text-soft);">Curso atual: <b>${esc((PDI_CURSO_OPTS.find(o=>o.v===state.pdiCursoAtual)||{}).l||"")}</b></span><b>${state.pdiPercent}%</b></div>
        <div class="progress-track" style="margin-top:8px;"><div class="progress-fill" style="width:${state.pdiPercent}%;"></div></div>
      </div>
      <div class="card">
        <h3>${icon("bell")}Presença nos encontros, Escola de Gestores</h3>
        <div class="row-between"><span style="font-size:13px;color:var(--text-soft);">${enc.done} de ${enc.total} confirmados</span><b>${encPct}%</b></div>
        <div class="progress-track" style="margin-top:8px;"><div class="progress-fill" style="width:${encPct}%;background:linear-gradient(90deg,var(--laranja),var(--amarelo));"></div></div>
      </div>
    </div>`;
}
