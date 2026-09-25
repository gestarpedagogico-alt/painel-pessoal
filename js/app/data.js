/* ============ HELPERS DE DATA (puros) ============
   Os dados estáticos que antes viviam neste arquivo (WEEK, ENCONTROS_GESTORES,
   FRENTES, MESES, BIMESTRE, TRIMESTRE, EIXOS, EIXOS_MEDIA, MAPA, STATUS_OPTS,
   PDI_CURSO_OPTS, NATURE_CLASS) agora vêm do Supabase — veja js/app/data-service.js
   (loadCatalog()) e supabase/schema.sql + supabase/seed.sql. Só os helpers puros
   que operam sobre um `item` recebido por parâmetro continuam aqui. */
export function parseISO(d){ const [y,m,day]=d.split("-").map(Number); return new Date(y, m-1, day); }
export function isPastEncontro(item){ const d=parseISO(item.data); d.setHours(23,59,0,0); return d < new Date(); }
export function isTodayEncontro(item){ const d=parseISO(item.data); const n=new Date(); return d.getFullYear()===n.getFullYear() && d.getMonth()===n.getMonth() && d.getDate()===n.getDate(); }
export function isThisWeekEncontro(item){
  const d = parseISO(item.data);
  const now = new Date();
  const dow = (now.getDay()+6)%7;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-dow);
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()+6, 23,59,59);
  return d>=monday && d<=sunday;
}
