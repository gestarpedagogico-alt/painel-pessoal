import { icon } from '../icons.js';
import { state } from '../state.js';
import { EIXOS, EIXOS_MEDIA, PDI_CURSO_OPTS } from '../data-service.js';
import { esc, edHtml } from '../render-helpers.js';

/* ============ PDI ============ */
function eixoCardHtml(key){
  const e = EIXOS[key];
  return `<div class="eixo-card">
    <div class="eixo-top" style="background:color-mix(in srgb, ${e.cor} 12%, transparent);">
      <h3 style="color:${e.cor};">${esc(e.nome)}</h3>
      <span class="tag" style="background:${e.cor};color:#fff;">${edHtml('eixo_'+key+'_prioridade', e.prioridade, "span")}</span>
    </div>
    <div class="eixo-body">
      ${e.cursos.map(c=>`<div class="curso-row"><span class="curso-mes">${c.m}</span><span>${esc(c.c)}</span></div>`).join("")}
      <div class="aplicacao"><b>Aplicação prática.</b> ${edHtml('eixo_'+key+'_aplicacao', e.aplicacao, "span")}</div>
    </div>
  </div>`;
}
export function renderPDI(){
  const el = document.getElementById("panel-pdi");
  el.innerHTML = `
    <div class="panel-head"><p class="eyebrow">Plano de Desenvolvimento Individual</p><h2>Trilha de estudos</h2>
      <p class="panel-sub">Blocos protegidos de quarta e sexta, das 16h às 18h. Estratégia híbrida: o Eixo A segue de forma sequencial nas quartas, e os Eixos C, G e B se alternam nas sextas conforme a janela de meses de cada um.</p></div>
    <div class="card" style="margin-bottom:16px;">
      <h3>${icon("pdi")}Avanço geral</h3>
      <div class="row-between"><span style="font-size:13px;color:var(--text-soft);">Curso atual: <b>${esc((PDI_CURSO_OPTS.find(o=>o.v===state.pdiCursoAtual)||{}).l||"")}</b></span><b>${state.pdiPercent}%</b></div>
      <div class="progress-track" style="margin-top:8px;"><div class="progress-fill" style="width:${state.pdiPercent}%;"></div></div>
    </div>
    <div class="grid" style="grid-template-columns:1fr;gap:16px;">
      ${eixoCardHtml("A")}${eixoCardHtml("C")}${eixoCardHtml("G")}${eixoCardHtml("B")}
    </div>
    <div class="card" style="margin-top:16px;">
      <h3>Demais eixos, prioridade média e média baixa</h3>
      <p class="panel-sub" style="margin-bottom:10px;">Cursos previstos a partir do mês 5, já no próximo trimestre. Ficam fora dos blocos de quarta e sexta por enquanto.</p>
      <div class="grid grid-3">${EIXOS_MEDIA.map(x=>`<div class="row-between" style="background:var(--surface-2);border-radius:var(--radius-sm);padding:9px 12px;font-size:13px;"><span>${esc(x.n)}</span><span class="tag tag-rotina">${x.p}</span></div>`).join("")}</div>
    </div>`;
}
