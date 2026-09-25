import { loadInitialState } from './state.js';
import { loadCatalog } from './data-service.js';
import { renderTabs, switchTab } from './tabs.js';
import { setupEditableDelegation, todayStr } from './render-helpers.js';
import { renderInicio } from './views/inicio.js';
import { renderSemana } from './views/semana.js';
import { renderMes } from './views/mes.js';
import { renderBimestre } from './views/bimestre.js';
import { renderTrimestre } from './views/trimestre.js';
import { renderPDI } from './views/pdi.js';
import { renderMapa } from './views/mapa.js';
import { renderIndicadores } from './views/indicadores.js';
import { renderRanking } from './views/ranking.js';

/* ============ INIT ============ */
function renderAll(){
  renderInicio(); renderSemana(); renderMes(); renderBimestre(); renderTrimestre(); renderPDI(); renderMapa();
  renderIndicadores(); renderRanking();
}
async function init(){
  document.getElementById("panel-inicio").innerHTML = `<p class="panel-sub" style="padding:24px 0;">Carregando dados do Supabase…</p>`;
  try{
    await Promise.all([loadCatalog(), loadInitialState()]);
  }catch(e){
    console.error('Falha ao carregar dados do Supabase', e);
    document.getElementById("panel-inicio").innerHTML = `<p class="panel-sub" style="padding:24px 0;">Não foi possível carregar os dados do Supabase. Verifique a conexão e recarregue a página.</p>`;
    return;
  }
  const t = todayStr();
  document.getElementById("brandMeta").textContent = t.dow.charAt(0).toUpperCase()+t.dow.slice(1)+" · "+t.full;
  renderTabs();
  renderAll();
  switchTab("inicio");
  setupEditableDelegation();
}
if(document.readyState==="loading"){ document.addEventListener("DOMContentLoaded", init); } else { init(); }
