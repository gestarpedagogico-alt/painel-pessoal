import { supabase } from './supabase-client.js';

/* ============ STATE ============
   `state` continua com a mesma forma de sempre (checks, pdiCursoAtual,
   pdiPercent, prioridades, pendencias, observacoes, entregaStatus, mesAtivo,
   edits), mas agora é carregado do Supabase (loadInitialState) e cada mutação
   grava só a fatia que mudou, em vez do blob inteiro no localStorage. */
export let state = null;

export function defaultState(){
  return {
    checks:{},
    pdiCursoAtual:'',
    pdiPercent:0,
    prioridades:'',
    pendencias:'',
    observacoes:'',
    entregaStatus:{},
    mesAtivo:'',
    edits:{},
  };
}

export async function loadInitialState(){
  state = defaultState();
  const [checksRes, statusRes, editsRes, estadoRes] = await Promise.all([
    supabase.from('checks').select('item_id, marcado'),
    supabase.from('entrega_status').select('mapa_id, status'),
    supabase.from('edits').select('chave, valor'),
    supabase.from('painel_estado').select('*').eq('id', 1).maybeSingle(),
  ]);
  (checksRes.data || []).forEach(r=>{ state.checks[r.item_id] = r.marcado; });
  (statusRes.data || []).forEach(r=>{ state.entregaStatus[r.mapa_id] = r.status; });
  (editsRes.data || []).forEach(r=>{ state.edits[r.chave] = r.valor; });
  if(estadoRes.data){
    state.pdiCursoAtual = estadoRes.data.pdi_curso_atual || '';
    state.pdiPercent = estadoRes.data.pdi_percent ?? 0;
    state.prioridades = estadoRes.data.prioridades || '';
    state.pendencias = estadoRes.data.pendencias || '';
    state.observacoes = estadoRes.data.observacoes || '';
    state.mesAtivo = estadoRes.data.mes_ativo || '';
  }
  return state;
}

/* ============ INDICADOR VISUAL DE SALVAMENTO ============ */
export function showSaveIndicator(){
  const el = document.getElementById('saveIndicator');
  if(!el) return;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(()=>el.classList.remove('show'), 1600);
}

/* ============ ESCRITAS NO SUPABASE ============
   Cada função faz a mutação otimista em `state` (a UI não espera o round-trip)
   e só então grava no Supabase; erros são logados, sem travar a interface,
   no mesmo espírito do try/catch silencioso que já existia com localStorage. */
export async function saveCheck(id, marcado){
  state.checks[id] = marcado;
  showSaveIndicator();
  try{
    const { error } = await supabase.from('checks').upsert({ item_id:id, marcado, atualizado_em:new Date().toISOString() });
    if(error) throw error;
  }catch(e){ console.error('Falha ao salvar check', id, e); }
}

export async function resetWeekChecks(ids){
  ids.forEach(id=>{ delete state.checks[id]; });
  showSaveIndicator();
  try{
    const { error } = await supabase.from('checks').delete().in('item_id', ids);
    if(error) throw error;
  }catch(e){ console.error('Falha ao reiniciar marcações da semana', e); }
}

export async function saveEntregaStatus(mapaId, status){
  state.entregaStatus[mapaId] = status;
  showSaveIndicator();
  try{
    const { error } = await supabase.from('entrega_status').upsert({ mapa_id:mapaId, status, atualizado_em:new Date().toISOString() });
    if(error) throw error;
  }catch(e){ console.error('Falha ao salvar status de entrega', mapaId, e); }
}

export async function saveEdit(chave, valor){
  state.edits[chave] = valor;
  showSaveIndicator();
  try{
    const { error } = await supabase.from('edits').upsert({ chave, valor, atualizado_em:new Date().toISOString() });
    if(error) throw error;
  }catch(e){ console.error('Falha ao salvar edição', chave, e); }
}

export async function savePainelEstado(patch){
  Object.assign(state, patch);
  showSaveIndicator();
  const row = { atualizado_em:new Date().toISOString() };
  if('pdiCursoAtual' in patch) row.pdi_curso_atual = patch.pdiCursoAtual;
  if('pdiPercent' in patch) row.pdi_percent = patch.pdiPercent;
  if('prioridades' in patch) row.prioridades = patch.prioridades;
  if('pendencias' in patch) row.pendencias = patch.pendencias;
  if('observacoes' in patch) row.observacoes = patch.observacoes;
  if('mesAtivo' in patch) row.mes_ativo = patch.mesAtivo;
  try{
    const { error } = await supabase.from('painel_estado').update(row).eq('id', 1);
    if(error) throw error;
  }catch(e){ console.error('Falha ao salvar estado do painel', patch, e); }
}
