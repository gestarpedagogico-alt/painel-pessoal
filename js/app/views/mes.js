import { icon } from '../icons.js';
import { state, savePainelEstado } from '../state.js';
import { MESES, TODOS_ENCONTROS_GESTORES } from '../data-service.js';
import { esc, edHtml, mesAtualKey } from '../render-helpers.js';

/* ============ MES ============ */
function encontrosDoMesHtml(mk){
  const doMes = TODOS_ENCONTROS_GESTORES.filter(it=>it.mes===mk);
  if(!doMes.length) return "";
  const rows = doMes.map(it=>{
    const done = !!state.checks[it.id];
    return `<div class="encontro-row compact ${done?'done':''}">
      <span class="chip chip-mini">${esc(it.dataLabel.split(" de ")[0])}</span>
      <div class="er-info">
        <div class="er-h">${esc(it.dow)}, ${esc(it.h)}</div>
        <div class="er-p">${esc(it.publico)} · ${esc(it.enc)}</div>
      </div>
    </div>`;
  }).join("");
  return `<div class="card" style="margin-top:14px;">
    <h3>${icon("bell")}Encontros da Escola de Gestores neste mês</h3>
    <div class="encontro-list">${rows}</div>
  </div>`;
}
export function renderMes(){
  const el = document.getElementById("panel-mes");
  const mk = state.mesAtivo || mesAtualKey();
  const m = MESES[mk];
  el.innerHTML = `
    <div class="panel-head"><p class="eyebrow">Visão mensal</p><h2>${m.label} de 2026</h2>
      <p class="panel-sub">O que precisa acontecer no começo, durante e no fim do mês.</p></div>
    <div class="month-tabs">${Object.keys(MESES).map(k=>`<button class="mtab" data-m="${k}" aria-selected="${k===mk}">${MESES[k].label}</button>`).join("")}</div>
    <div class="alert" style="margin-bottom:16px;">${icon("bell")}${edHtml('mes_'+mk+'_nota', m.nota)}</div>
    <div class="grid" style="grid-template-columns:1fr;gap:0;">
      <div class="card">
        <div class="phase p1"><h4>Início do mês</h4>${edHtml('mes_'+mk+'_inicio', m.inicio, "p")}</div>
        <div class="phase p2"><h4>Durante o mês</h4>${edHtml('mes_'+mk+'_durante', m.durante, "p")}</div>
        <div class="phase p3"><h4>Final do mês</h4>${edHtml('mes_'+mk+'_fim', m.fim, "p")}</div>
      </div>
    </div>
    ${encontrosDoMesHtml(mk)}`;
  el.querySelectorAll(".mtab").forEach(btn=>{
    btn.addEventListener("click", ()=>{ savePainelEstado({mesAtivo: btn.dataset.m}); renderMes(); });
  });
}
