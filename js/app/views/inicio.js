import { icon } from '../icons.js';
import { state, saveCheck, savePainelEstado } from '../state.js';
import { PDI_CURSO_OPTS, proximoEncontroGestores } from '../data-service.js';
import { esc, todayStr, mesAtualKey } from '../render-helpers.js';
import { isTodayEncontro, isThisWeekEncontro } from '../data.js';
import { renderIndicadores } from './indicadores.js';

/* ============ INICIO ============ */
function proximasEntregas(){
  const mk = mesAtualKey();
  const map = {set:"Fechamento do relatório de setembro e consolidação da frequência da ImersA",
    out:"Fechamento do relatório de outubro e acompanhamento das Atas de Formação",
    nov:"Relatório executivo do Ciclo Formativo, até 11 de dezembro, e síntese trimestral da IMERSA"};
  return [
    map[mk],
    "Consolidação semanal de devolutivas e pendências do setor",
    "Registro mensal de estudos do PDI, Item 10 do Plano de Trabalho",
  ];
}
function proximoEncontroCardHtml(){
  const prox = proximoEncontroGestores();
  if(!prox) return "";
  const hoje = isTodayEncontro(prox);
  const semana = isThisWeekEncontro(prox);
  const confirmado = !!state.checks[prox.id];
  const rotulo = hoje ? "É hoje" : (semana ? "Esta semana" : "Próximo compromisso");
  return `<div class="card card-alerta" style="margin-top:16px;">
    <div class="row-between" style="flex-wrap:wrap;gap:10px;">
      <h3 style="margin:0;">${icon("bell")}Encontro obrigatório, Escola de Gestores, Pacajá</h3>
      <span class="chip chip-obrigatorio">${rotulo}</span>
    </div>
    <div class="encontro-destaque">
      <div class="ed-data">${esc(prox.dataLabel)}<span>${esc(prox.dow)}</span></div>
      <div class="ed-info">
        <div class="ed-h">${esc(prox.h)}${prox.mes==="dez"?" · presencial em Pacajá":" · online"}</div>
        <div class="ed-p">${esc(prox.publico)} · ${esc(prox.enc)}</div>
      </div>
      <label class="confirm-check"><input type="checkbox" data-id="${prox.id}" ${confirmado?"checked":""}><span>Presença confirmada</span></label>
    </div>
    <p class="small-note" style="margin-top:10px;">Presença obrigatória em todos os dez encontros online, de setembro a novembro, mais o Seminário de Integração presencial em 4 de dezembro. Lista completa na aba Semana.</p>
  </div>`;
}
export function renderInicio(){
  const t = todayStr();
  const cursoAtual = PDI_CURSO_OPTS.find(o=>o.v===state.pdiCursoAtual) || PDI_CURSO_OPTS[0];
  const el = document.getElementById("panel-inicio");
  el.innerHTML = `
    <div class="hero">
      <div class="date"><small>${t.dow}</small>${t.full}</div>
      <div class="hero-stat"><div class="num">${state.pdiPercent}%</div><div class="lbl">avanço do PDI</div></div>
    </div>
    ${proximoEncontroCardHtml()}
    <div class="grid grid-3" style="margin-top:16px;">
      <div class="card">
        <h3>${icon("flag")}Prioridades da semana</h3>
        <textarea class="free" id="inpPrioridades" placeholder="O que precisa sair até sexta">${esc(state.prioridades)}</textarea>
      </div>
      <div class="card">
        <h3>${icon("bell")}Pendências</h3>
        <textarea class="free" id="inpPendencias" placeholder="O que ficou em aberto">${esc(state.pendencias)}</textarea>
      </div>
      <div class="card">
        <h3>${icon("check")}Observações</h3>
        <textarea class="free" id="inpObservacoes" placeholder="Anotações livres">${esc(state.observacoes)}</textarea>
      </div>
    </div>
    <div class="grid grid-2" style="margin-top:14px;">
      <div class="card">
        <h3>${icon("target")}Próximas entregas</h3>
        <ul class="mini-list">${proximasEntregas().map(x=>`<li><span class="dot"></span>${esc(x)}</li>`).join("")}</ul>
      </div>
      <div class="card">
        <h3>${icon("pdi")}Curso atual do PDI</h3>
        <div class="field-label">Curso em andamento</div>
        <select class="pdi-select" id="selCursoAtual">${PDI_CURSO_OPTS.map(o=>`<option value="${o.v}" ${o.v===state.pdiCursoAtual?"selected":""}>${esc(o.l)}</option>`).join("")}</select>
        <div class="field-label" style="margin-top:12px;">Percentual concluído</div>
        <div class="row-between"><input type="range" min="0" max="100" step="5" id="rngPercent" value="${state.pdiPercent}" style="flex:1;accent-color:var(--verde);"><b style="width:42px;text-align:right;">${state.pdiPercent}%</b></div>
        <div class="progress-track" style="margin-top:8px;"><div class="progress-fill" style="width:${state.pdiPercent}%;"></div></div>
        <div class="alert" style="margin-top:14px;">${icon("bell")}<span>As Jornadas Pedagógicas entram no planejamento somente a partir de novembro de 2026. Setembro e outubro seguem sem essa frente.</span></div>
      </div>
    </div>`;
  document.getElementById("inpPrioridades").addEventListener("input", e=>{ savePainelEstado({prioridades:e.target.value}); });
  document.getElementById("inpPendencias").addEventListener("input", e=>{ savePainelEstado({pendencias:e.target.value}); });
  document.getElementById("inpObservacoes").addEventListener("input", e=>{ savePainelEstado({observacoes:e.target.value}); });
  const ccCard = el.querySelector(".confirm-check input");
  if(ccCard){ ccCard.addEventListener("change", e=>{ saveCheck(e.target.dataset.id, e.target.checked); renderIndicadores(); }); }
  document.getElementById("selCursoAtual").addEventListener("change", e=>{ savePainelEstado({pdiCursoAtual:e.target.value}); });
  const rng = document.getElementById("rngPercent");
  rng.addEventListener("input", e=>{
    state.pdiPercent = Number(e.target.value);
    rng.parentElement.querySelector("b").textContent = state.pdiPercent+"%";
    rng.closest(".card").querySelector(".progress-fill").style.width = state.pdiPercent+"%";
    document.querySelector(".hero-stat .num").textContent = state.pdiPercent+"%";
  });
  rng.addEventListener("change", ()=>savePainelEstado({pdiPercent:state.pdiPercent}));
}
