import { supabase } from './supabase-client.js';
import { parseISO } from './data.js';

/* ============ DADOS DE CATÁLOGO, CARREGADOS DO SUPABASE ============
   Estas bindings têm exatamente a mesma forma que os antigos `export const`
   literais de js/app/data.js, para que as views não precisem mudar a leitura,
   só a origem do import. São preenchidas por loadCatalog() no início do app e
   nunca são escritas de volta ao banco (catálogo = somente leitura). */
export let NATURE_CLASS = {};
export let WEEK = [];
export let ENCONTROS_GESTORES = [];
export let SEMINARIO_GESTORES = null;
export let TODOS_ENCONTROS_GESTORES = [];
export let MESES = {};
export let BIMESTRE = [];
export let TRIMESTRE = [];
export let EIXOS = {};
export let EIXOS_MEDIA = [];
export let MAPA = [];
export let STATUS_OPTS = [];
export let PDI_CURSO_OPTS = [];

const ORDEM_PDI_LETRAS = ['A', 'C', 'G', 'B'];

export function proximoEncontroGestores(){
  const now = new Date();
  const future = TODOS_ENCONTROS_GESTORES.filter(it=>{ const d=parseISO(it.data); d.setHours(23,59,0,0); return d>=now; });
  future.sort((a,b)=>parseISO(a.data)-parseISO(b.data));
  return future[0] || null;
}

export async function loadCatalog(){
  const [
    naturezasRes, diasRes, blocosRes, encontrosRes, mesesRes, bimestreRes,
    frentesRes, eixosRes, eixosCursosRes, eixosMediaRes, mapaRes, statusRes,
  ] = await Promise.all([
    supabase.from('naturezas').select('slug, rotulo'),
    supabase.from('semana_dias').select('id, nome, foco, cor, ordem').order('ordem'),
    supabase.from('semana_blocos').select('id, dia_id, ordem, hora, tarefa, natureza_slug, bloqueado, almoco').order('ordem'),
    supabase.from('encontros_gestores').select('id, data, mes_chave, data_label, dia_semana, horario, publico, encontro_label, is_seminario').order('data'),
    supabase.from('meses').select('chave, rotulo, nota, inicio, durante, fim').order('ordem'),
    supabase.from('bimestre_itens').select('ordem, objetivo, evidencia, sucesso, proximo_passo').order('ordem'),
    supabase.from('frentes').select('n, nome, peso, meta, acoes, produto, prazo, evidencia, resultado').order('n'),
    supabase.from('eixos').select('letra, nome, prioridade, cor, aplicacao'),
    supabase.from('eixos_cursos').select('eixo_letra, ordem, mes_label, curso').order('ordem'),
    supabase.from('eixos_media').select('nome, prioridade, ordem').order('ordem'),
    supabase.from('mapa_entregas').select('id, acao, entrega, periodicidade, evidencia, meta, ordem').order('ordem'),
    supabase.from('status_opts').select('valor, rotulo, ordem').order('ordem'),
  ]);

  const naturezaLabelBySlug = {};
  NATURE_CLASS = {};
  (naturezasRes.data || []).forEach(r=>{ NATURE_CLASS[r.rotulo] = r.slug; naturezaLabelBySlug[r.slug] = r.rotulo; });

  const blocosPorDia = {};
  (blocosRes.data || []).forEach(b=>{
    (blocosPorDia[b.dia_id] = blocosPorDia[b.dia_id] || []).push(b);
  });
  WEEK = (diasRes.data || []).map(d=>({
    key: d.id, nome: d.nome, foco: d.foco, cor: d.cor,
    blocos: (blocosPorDia[d.id] || []).map(b=>{
      if(b.almoco) return { id: b.id, lunch: true };
      return { id: b.id, h: b.hora, t: b.tarefa, n: naturezaLabelBySlug[b.natureza_slug] || '', lock: !!b.bloqueado };
    }),
  }));

  const encontrosAll = (encontrosRes.data || []).map(it=>({
    id: it.id, data: it.data, mes: it.mes_chave, dataLabel: it.data_label,
    dow: it.dia_semana, h: it.horario, publico: it.publico, enc: it.encontro_label,
  }));
  ENCONTROS_GESTORES = encontrosAll.filter((it,i)=>!(encontrosRes.data[i].is_seminario));
  SEMINARIO_GESTORES = encontrosAll.find((it,i)=>encontrosRes.data[i].is_seminario) || null;
  TODOS_ENCONTROS_GESTORES = SEMINARIO_GESTORES ? [...ENCONTROS_GESTORES, SEMINARIO_GESTORES] : [...ENCONTROS_GESTORES];

  MESES = {};
  (mesesRes.data || []).forEach(m=>{
    MESES[m.chave] = { label: m.rotulo, nota: m.nota, inicio: m.inicio, durante: m.durante, fim: m.fim };
  });

  BIMESTRE = (bimestreRes.data || []).map(r=>({ o: r.objetivo, e: r.evidencia, s: r.sucesso, p: r.proximo_passo }));

  TRIMESTRE = (frentesRes.data || []).map(r=>({
    n: r.n, nome: r.nome, peso: r.peso, meta: r.meta, acoes: r.acoes,
    prod: r.produto, prazo: r.prazo, ev: r.evidencia, res: r.resultado,
  }));

  const cursosPorEixo = {};
  (eixosCursosRes.data || []).forEach(c=>{
    (cursosPorEixo[c.eixo_letra] = cursosPorEixo[c.eixo_letra] || []).push({ m: c.mes_label, c: c.curso });
  });
  EIXOS = {};
  (eixosRes.data || []).forEach(e=>{
    EIXOS[e.letra] = { nome: e.nome, prioridade: e.prioridade, cor: e.cor, cursos: cursosPorEixo[e.letra] || [], aplicacao: e.aplicacao };
  });

  EIXOS_MEDIA = (eixosMediaRes.data || []).map(x=>({ n: x.nome, p: x.prioridade }));

  MAPA = (mapaRes.data || []).map(r=>({ id: r.id, a: r.acao, e: r.entrega, per: r.periodicidade, ev: r.evidencia, meta: r.meta }));

  STATUS_OPTS = (statusRes.data || []).map(o=>({ v: o.valor, l: o.rotulo }));

  PDI_CURSO_OPTS = [];
  ORDEM_PDI_LETRAS.forEach(letra=>{
    (EIXOS[letra] ? EIXOS[letra].cursos : []).forEach(c=>PDI_CURSO_OPTS.push({ v: letra + '|' + c.c, l: c.c }));
  });
}
