import { TRIMESTRE } from '../data-service.js';
import { state } from '../state.js';
import { ed, edHtml } from '../render-helpers.js';

/* ============ TRIMESTRE ============ */
export function triText(n, field, fallback){ return ed('tri_'+n+'_'+field, fallback); }
export function triPeso(fr){
  const raw = state.edits['tri_'+fr.n+'_peso'];
  if(raw===undefined || raw===null || raw==="") return fr.peso;
  const num = parseFloat(String(raw).replace(",", ".").replace("%",""));
  return isNaN(num) ? fr.peso : num;
}
export function renderTrimestre(){
  const el = document.getElementById("panel-trimestre");
  el.innerHTML = `
    <div class="panel-head"><p class="eyebrow">1 de setembro a 1 de dezembro de 2026</p><h2>Visão trimestral</h2>
      <p class="panel-sub">Metas, ações, produtos, prazos, evidências e resultado esperado para as 11 frentes do Plano de Trabalho.</p></div>
    <div class="table-wrap"><table><thead><tr><th>Frente</th><th>Meta</th><th>Ações</th><th>Produto</th><th>Prazo</th><th>Evidência</th><th>Resultado esperado</th></tr></thead>
    <tbody>${TRIMESTRE.map(r=>`<tr><td><b>${r.n}. ${edHtml('tri_'+r.n+'_nome', r.nome)}</b><br><span class="wpeso">${edHtml('tri_'+r.n+'_peso', String(r.peso), "span")}%</span></td><td>${edHtml('tri_'+r.n+'_meta', r.meta)}</td><td>${edHtml('tri_'+r.n+'_acoes', r.acoes)}</td><td>${edHtml('tri_'+r.n+'_prod', r.prod)}</td><td>${edHtml('tri_'+r.n+'_prazo', r.prazo)}</td><td>${edHtml('tri_'+r.n+'_ev', r.ev)}</td><td>${edHtml('tri_'+r.n+'_res', r.res)}</td></tr>`).join("")}</tbody></table></div>`;
}
