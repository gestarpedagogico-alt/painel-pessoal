import { icon } from './icons.js';

/* ============ TABS ============ */
export const TABS = [
  {key:"inicio", label:"Início", icon:"home"},
  {key:"semana", label:"Semana", icon:"week"},
  {key:"mes", label:"Mês", icon:"month"},
  {key:"bimestre", label:"Bimestre", icon:"bim"},
  {key:"trimestre", label:"Trimestre", icon:"tri"},
  {key:"pdi", label:"PDI", icon:"pdi"},
  {key:"mapa", label:"Mapa de entregas", icon:"map"},
  {key:"indicadores", label:"Indicadores", icon:"chart"},
  {key:"ranking", label:"Ranking", icon:"ranking"},
];
export let activeTab = "inicio";

export function renderTabs(){
  const nav = document.getElementById("tabs");
  nav.innerHTML = TABS.map(t=>`<button class="tab" role="tab" data-tab="${t.key}" aria-selected="${t.key===activeTab}">${icon(t.icon)}${t.label}</button>`).join("");
  nav.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{ switchTab(btn.dataset.tab); });
  });
}
export function switchTab(key){
  activeTab = key;
  TABS.forEach(t=>{
    document.getElementById("panel-"+t.key).hidden = t.key!==key;
  });
  document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected", String(b.dataset.tab===key)));
  window.scrollTo({top:0, behavior:"instant"});
}
