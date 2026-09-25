import { icon } from '../icons.js';
import { state } from '../state.js';
import { TRIMESTRE, STATUS_OPTS } from '../data-service.js';
import { esc } from '../render-helpers.js';
import { triText, triPeso } from './trimestre.js';

/* ============ RANKING ============ */
const STATUS_PRIORITY = {bloqueado:0, aguardando:1, afazer:2, andamento:3, concluido:4};
function frenteStatus(n){ return state.entregaStatus["m"+n] || "afazer"; }
function statusLabel(v){ return (STATUS_OPTS.find(o=>o.v===v)||{}).l || v; }
function rankingRowHtml(rank, fr){
  const st = frenteStatus(fr.n);
  const nome = triText(fr.n, "nome", fr.nome);
  const peso = triPeso(fr);
  return `<div class="rank-row">
    <div class="rank-pos">${rank}</div>
    <div class="rank-info"><div class="rank-nome">${fr.n}. ${esc(nome)}</div><div class="rank-peso">${peso}% do trimestre</div></div>
    <span class="badge-status st-${st}">${esc(statusLabel(st))}</span>
  </div>`;
}
export function renderRanking(){
  const el = document.getElementById("panel-ranking");
  const byUrgencia = [...TRIMESTRE].sort((a,b)=> STATUS_PRIORITY[frenteStatus(a.n)] - STATUS_PRIORITY[frenteStatus(b.n)] || a.n-b.n);
  const byPeso = [...TRIMESTRE].sort((a,b)=> triPeso(b) - triPeso(a) || a.n-b.n);
  el.innerHTML = `
    <div class="panel-head"><p class="eyebrow">Ranking</p><h2>Ranking das frentes do Plano de Trabalho</h2>
      <p class="panel-sub">As 11 frentes do Plano, em dois recortes: o que precisa de atenção primeiro, e o que tem mais peso no trimestre. O status de cada uma é o mesmo marcado na aba Mapa de entregas.</p></div>
    <div class="grid grid-2">
      <div class="card">
        <h3>${icon("bell")}Por urgência</h3>
        <p class="panel-sub" style="margin-bottom:10px;">Bloqueado e aguardando aparecem primeiro, como alerta.</p>
        <div class="rank-list">${byUrgencia.map((fr,i)=>rankingRowHtml(i+1,fr)).join("")}</div>
      </div>
      <div class="card">
        <h3>${icon("tri")}Por peso no trimestre</h3>
        <p class="panel-sub" style="margin-bottom:10px;">Da frente de maior peso percentual para a de menor.</p>
        <div class="rank-list">${byPeso.map((fr,i)=>rankingRowHtml(i+1,fr)).join("")}</div>
      </div>
    </div>`;
}
