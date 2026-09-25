import { icon } from '../icons.js';
import { state, saveCheck, resetWeekChecks } from '../state.js';
import { WEEK, TODOS_ENCONTROS_GESTORES } from '../data-service.js';
import { isPastEncontro, isTodayEncontro, isThisWeekEncontro } from '../data.js';
import { esc, edHtml, natClass } from '../render-helpers.js';
import { renderIndicadores } from './indicadores.js';

/* ============ SEMANA ============ */
function encontrosGestoresListHtml(){
  const rows = TODOS_ENCONTROS_GESTORES.map(it=>{
    const done = !!state.checks[it.id];
    const past = isPastEncontro(it);
    const hoje = isTodayEncontro(it);
    const semana = isThisWeekEncontro(it);
    let badge = "";
    if(hoje) badge = `<span class="chip chip-hoje">Hoje</span>`;
    else if(past) badge = `<span class="chip chip-passado">Realizado</span>`;
    else if(semana) badge = `<span class="chip chip-semana">Esta semana</span>`;
    return `<div class="encontro-row ${done?'done':''} ${hoje?'is-today':''}">
      <label class="confirm-check"><input type="checkbox" data-id="${it.id}" ${done?"checked":""}><span></span></label>
      <div class="er-data">${esc(it.dataLabel)}<span>${esc(it.dow)}</span></div>
      <div class="er-info">
        <div class="er-h">${esc(it.h)}${it.mes==="dez"?" · presencial em Pacajá":" · online, presença obrigatória"}</div>
        <div class="er-p">${esc(it.publico)} · ${esc(it.enc)}</div>
      </div>
      ${badge}
    </div>`;
  }).join("");
  return `<div class="card" style="margin-bottom:16px;">
    <h3>${icon("bell")}Escola de Gestores e Lideranças Educacionais, Pacajá</h3>
    <p class="panel-sub" style="margin-bottom:12px;">Dez encontros online, de setembro a novembro, mais o Seminário de Integração presencial em 4 de dezembro. Presença obrigatória em todos. Estes compromissos têm data marcada e não se repetem toda semana, por isso ficam à parte da grade abaixo.</p>
    <div class="encontro-list">${rows}</div>
  </div>`;
}
export function renderSemana(){
  const el = document.getElementById("panel-semana");
  el.innerHTML = `
    <div class="panel-head"><p class="eyebrow">Segunda a sexta</p><h2>Cronograma semanal</h2>
      <p class="panel-sub">Jornada das 9h às 18h, almoço das 13h às 14h. Quarta e sexta, das 16h às 18h, ficam protegidas para o PDI.</p></div>
    ${encontrosGestoresListHtml()}
    <div class="week-toolbar"><button class="btn" id="btnResetWeek">${icon("reset")}Reiniciar marcações da semana</button></div>
    <div class="week-grid">${WEEK.map(renderDay).join("")}</div>`;
  el.querySelectorAll(".block input[type=checkbox]").forEach(cb=>{
    cb.addEventListener("change", e=>{
      const id = e.target.dataset.id;
      saveCheck(id, e.target.checked);
      e.target.closest(".block").classList.toggle("done", e.target.checked);
    });
  });
  el.querySelectorAll(".encontro-row input[type=checkbox]").forEach(cb=>{
    cb.addEventListener("change", e=>{
      const id = e.target.dataset.id;
      saveCheck(id, e.target.checked);
      e.target.closest(".encontro-row").classList.toggle("done", e.target.checked);
      renderIndicadores();
    });
  });
  document.getElementById("btnResetWeek").addEventListener("click", ()=>{
    const ids = [];
    WEEK.forEach(d=>d.blocos.forEach(b=>{ if(!b.lunch) ids.push(b.id); }));
    resetWeekChecks(ids);
    renderSemana();
  });
}
function renderDay(day){
  return `<div class="day-card">
    <div class="day-head" style="background:${day.cor};"><div class="d">${day.nome}-feira</div><div class="f">${edHtml('foco_'+day.key, day.foco)}</div></div>
    <div class="day-body">${day.blocos.map(b=>{
      if(b.lunch) return `<div class="lunch">Almoço, 13h às 14h</div>`;
      const done = !!state.checks[b.id];
      return `<div class="block ${b.n==='PDI'?'pdi-block':''} ${done?'done':''}">
        ${b.lock ? `<span class="lock">${icon("lock")}</span>` : `<input type="checkbox" data-id="${b.id}" ${done?"checked":""}>`}
        <div style="flex:1;min-width:0;">
          <div class="btime">${edHtml('h_'+b.id, b.h)}</div>
          ${edHtml('t_'+b.id, b.t, "div", "btxt")}
          <span class="tag tag-${natClass(b.n)}">${b.n}</span>
        </div>
      </div>`;
    }).join("")}</div>
  </div>`;
}
