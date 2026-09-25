import { state, saveEdit } from './state.js';
import { NATURE_CLASS } from './data-service.js';
import { renderRanking } from './views/ranking.js';

/* ============ HELPERS ============ */
export function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function natClass(n){ return NATURE_CLASS[n] || 'rotina'; }
export function pct(n,d){ return Math.round((n/d)*100); }

/* ============ EDITABLE TEXT ============ */
export function ed(key, fallback){
  const v = state.edits && state.edits[key];
  return (v!==undefined && v!==null && v!=="") ? v : fallback;
}
export function edHtml(key, fallback, tag, extra){
  tag = tag || "span";
  return '<'+tag+' class="editable '+(extra||'')+'" contenteditable="true" spellcheck="false" data-edit-key="'+key+'">'+esc(ed(key,fallback)).replace(/\n/g,"<br>")+'</'+tag+'>';
}
export function setupEditableDelegation(){
  const root = document.querySelector("main.wrap");
  if(!root || root._editWired) return;
  root._editWired = true;
  root.addEventListener("input", e=>{
    const t = e.target;
    if(!(t instanceof HTMLElement) || !t.hasAttribute("data-edit-key")) return;
    const key = t.getAttribute("data-edit-key");
    const value = (t.innerText || "").replace(/\n+$/,"");
    saveEdit(key, value);
    if(key.startsWith("tri_") && (key.endsWith("_peso") || key.endsWith("_nome"))){
      renderRanking();
    }
  });
}
export function todayStr(){
  const d = new Date();
  const dias=["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
  const meses=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  return {dow:dias[d.getDay()], full:d.getDate()+" de "+meses[d.getMonth()]+" de "+d.getFullYear(), d};
}
export function mesAtualKey(){
  const m = new Date().getMonth(); // 8=set,9=out,10=nov
  if(m<=8) return "set"; if(m===9) return "out"; return "nov";
}
