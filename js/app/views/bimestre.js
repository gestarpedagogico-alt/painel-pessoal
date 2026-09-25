import { BIMESTRE } from '../data-service.js';
import { edHtml } from '../render-helpers.js';

/* ============ BIMESTRE ============ */
export function renderBimestre(){
  const el = document.getElementById("panel-bimestre");
  el.innerHTML = `
    <div class="panel-head"><p class="eyebrow">Setembro a dezembro</p><h2>Acompanhamento bimestral</h2>
      <p class="panel-sub">Pontos de revisão mais estratégicos, a cada dois meses.</p></div>
    <div class="table-wrap"><table><thead><tr><th>O que acompanhar</th><th>Evidência</th><th>Situação esperada</th><th>Próximo encaminhamento</th></tr></thead>
    <tbody>${BIMESTRE.map((r,i)=>`<tr><td><b>${edHtml('bim_'+i+'_o', r.o)}</b></td><td>${edHtml('bim_'+i+'_e', r.e)}</td><td>${edHtml('bim_'+i+'_s', r.s)}</td><td>${edHtml('bim_'+i+'_p', r.p)}</td></tr>`).join("")}</tbody></table></div>`;
}
