import { state, saveEntregaStatus } from '../state.js';
import { MAPA, STATUS_OPTS } from '../data-service.js';
import { edHtml } from '../render-helpers.js';
import { renderIndicadores } from './indicadores.js';
import { renderRanking } from './ranking.js';

/* ============ MAPA DE ENTREGAS ============ */
function statusOptionsHtml(current){
  return STATUS_OPTS.map(o=>`<option value="${o.v}" ${o.v===current?"selected":""}>${o.l}</option>`).join("");
}
export function renderMapa(){
  const el = document.getElementById("panel-mapa");
  el.innerHTML = `
    <div class="panel-head"><p class="eyebrow">Rotina, mês e trimestre, na mesma tabela</p><h2>Mapa de entregas</h2>
      <p class="panel-sub">Cada atividade recorrente da rotina alimenta uma entrega, com sua periodicidade, evidência e a meta do Plano de Trabalho a que se conecta. Marque o status conforme o andamento.</p></div>
    <div class="table-wrap"><table><thead><tr><th>Atividade recorrente</th><th>Entrega relacionada</th><th>Periodicidade</th><th>Evidência</th><th>Meta do Plano</th><th>Status</th></tr></thead>
    <tbody>${MAPA.map(r=>{
      const st = state.entregaStatus[r.id] || "afazer";
      return `<tr><td><b>${edHtml('mapa_'+r.id+'_a', r.a)}</b></td><td>${edHtml('mapa_'+r.id+'_e', r.e)}</td><td>${edHtml('mapa_'+r.id+'_per', r.per)}</td><td>${edHtml('mapa_'+r.id+'_ev', r.ev)}</td><td>${edHtml('mapa_'+r.id+'_meta', r.meta)}</td>
      <td><select class="status-select st-${st}" data-id="${r.id}">${statusOptionsHtml(st)}</select></td></tr>`;
    }).join("")}</tbody></table></div>`;
  el.querySelectorAll(".status-select").forEach(sel=>{
    sel.addEventListener("change", e=>{
      const id = e.target.dataset.id, v = e.target.value;
      saveEntregaStatus(id, v);
      STATUS_OPTS.forEach(o=>e.target.classList.remove("st-"+o.v));
      e.target.classList.add("st-"+v);
      renderIndicadores();
      renderRanking();
    });
  });
}
