# Migração para Supabase — status

Documento de continuidade da migração do painel de dados estáticos/`localStorage`
para Supabase/PostgreSQL. Plano completo original em
`C:\Users\Tecnologia\.claude\plans\atualmente-o-sistema-utiliza-streamed-pudding.md`
(contexto, levantamento de dados e schema completo já estão lá).

## Decisões já tomadas

- **Dataset único e compartilhado**, não por usuário — o gate de login
  (`login.html`/`js/auth-guard.js`) continua exatamente como está, sem virar
  autenticação real. Não há coluna de usuário em nenhuma tabela.
- **Escopo replicado 1:1** com o app atual — só o que já existia como
  leitura/escrita continuou existindo (nenhuma UI nova de criar/excluir linhas
  foi adicionada).
- RLS habilitado em todas as tabelas, com policies permissivas para a `anon key`
  (catálogo só `SELECT`; estado `SELECT/INSERT/UPDATE/DELETE`) — mesma
  concessão de segurança já aceita hoje para o gate de login.

## O que já foi feito

### Banco de dados (arquivos prontos, ainda não executados no Supabase)
- `supabase/schema.sql` — 16 tabelas (12 de catálogo + 4 de estado), com PKs,
  FKs, constraints e as policies de RLS.
- `supabase/seed.sql` — `INSERT`s com a transcrição literal de tudo que estava
  hardcoded em `js/app/data.js` e em `defaultState()` de `js/app/state.js`.
  Nenhum dado foi inventado.

### Código (já reescrito no repositório)
- `js/app/supabase-client.js` **(novo)** — cria o client do Supabase.
  **Contém placeholders `SUPABASE_URL`/`SUPABASE_ANON_KEY` que ainda precisam
  ser preenchidos com os dados reais do projeto.**
- `js/app/data-service.js` **(novo)** — `loadCatalog()` busca todas as tabelas
  de catálogo no Supabase e monta em memória `WEEK`, `ENCONTROS_GESTORES`,
  `SEMINARIO_GESTORES`, `TODOS_ENCONTROS_GESTORES`, `TRIMESTRE`, `MESES`,
  `BIMESTRE`, `EIXOS`, `EIXOS_MEDIA`, `MAPA`, `STATUS_OPTS`, `PDI_CURSO_OPTS`,
  `NATURE_CLASS` — nas mesmas formas que `data.js` expunha antes. Também tem
  `proximoEncontroGestores()`.
- `js/app/data.js` **(reduzido)** — só restaram os 4 helpers puros de data por
  item (`parseISO`, `isPastEncontro`, `isTodayEncontro`, `isThisWeekEncontro`).
- `js/app/state.js` **(reescrito)** — `loadInitialState()` agora é `async` e lê
  do Supabase (`painel_estado`, `checks`, `entrega_status`, `edits`). O antigo
  `scheduleSave()` genérico foi substituído por funções específicas, cada uma
  fazendo a mutação otimista em `state` e depois a escrita real no Supabase:
  `saveCheck(id, marcado)`, `resetWeekChecks(ids)`, `saveEntregaStatus(mapaId, status)`,
  `saveEdit(chave, valor)`, `savePainelEstado(patch)`.
- `js/app/main.js` — `init()` agora é `async`, dá `await` em `loadCatalog()` +
  `loadInitialState()` antes do primeiro `renderAll()`, com uma mensagem de
  carregamento simples enquanto isso.
- `js/app/render-helpers.js` — `setupEditableDelegation()` agora chama
  `saveEdit()` em vez do `scheduleSave()` genérico; import de `NATURE_CLASS`
  trocado para `data-service.js`.
- Views atualizadas (imports trocados para `data-service.js` e pontos de
  escrita trocados para as novas funções de `state.js`):
  `inicio.js`, `semana.js`, `mes.js`, `mapa.js` (escrevem estado) e
  `bimestre.js`, `trimestre.js`, `pdi.js`, `indicadores.js`, `ranking.js`
  (só leitura, apenas trocaram a origem do import).
- `CLAUDE.md` — atualizado para descrever a nova arquitetura (layout de
  arquivos, dados de catálogo no Supabase, estado/persistência via Supabase,
  notas de módulos).

### Verificações já feitas
- `node --check` em todos os arquivos `.js` do projeto — sem erro de sintaxe.
- Confirmado por grep: nenhum uso de `localStorage`/`scheduleSave`/import de
  `data.js` restante fora do esperado (o gate de login continua usando
  `localStorage` normalmente, isso é intencional).
- **Ainda não testado num navegador de verdade** — sem projeto Supabase
  configurado, não dá para validar a aplicação rodando de ponta a ponta.

## O que falta fazer

1. **Configurar o projeto Supabase**
   - Abrir `js/app/supabase-client.js` e colar a URL + a anon key do projeto
     Supabase real, no lugar de `SUPABASE_URL`/`SUPABASE_ANON_KEY`.
2. **Rodar os scripts SQL**
   - No SQL Editor do Supabase, rodar `supabase/schema.sql` primeiro, depois
     `supabase/seed.sql`.
   - Conferir no Table Editor que as 16 tabelas existem com as contagens
     esperadas (ex.: 11 linhas em `frentes`, 12 em `mapa_entregas` e em
     `entrega_status`, 1 linha em `painel_estado`, 2 em `checks`).
3. **Validar a aplicação rodando de verdade** (nada disso foi testado ainda)
   - Servir o projeto localmente (`python -m http.server` ou equivalente —
     obrigatório por causa dos ES modules) e abrir pelo `login.html`.
   - Comparar cada aba visualmente com o comportamento de antes da migração.
   - Testar escrita real: marcar/desmarcar checkbox da semana, mudar status no
     Mapa de entregas, editar um texto inline, mexer no slider do PDI, usar
     "Reiniciar marcações da semana" — recarregar a página (F5) depois de cada
     ação e confirmar que persistiu (veio do Supabase, não do `localStorage`).
   - Conferir no Supabase (Table Editor) que cada ação acima gerou a
     linha/atualização esperada na tabela correspondente.
4. **Decidir o destino de `data.js` e do `localStorage` antigo**
   - Depois de validado, não é obrigatório apagar nada, mas vale decidir se
     `js/app/data.js` (que já não tem mais dados, só helpers) fica com esse
     nome ou se os dados antigos que ainda estejam em `localStorage` no
     navegador de produção precisam de algum aviso/limpeza para quem já usava
     o painel antes da migração.
5. **Só depois de tudo validado**: considerar remover/arquivar
   `supabase/seed.sql` do fluxo normal (ele só deve rodar uma vez, na criação
   do banco) e revisar se as policies de RLS atendem o uso real (por exemplo,
   se um dia for adicionada autenticação real, as policies atuais — abertas
   para a `anon key` — precisarão ser revistas).

## Arquivos-chave para retomar

- Plano completo: `C:\Users\Tecnologia\.claude\plans\atualmente-o-sistema-utiliza-streamed-pudding.md`
- Schema: `supabase/schema.sql`
- Seed: `supabase/seed.sql`
- Client Supabase (credenciais aqui): `js/app/supabase-client.js`
- Camada de dados: `js/app/data-service.js`
- Estado/escrita: `js/app/state.js`
