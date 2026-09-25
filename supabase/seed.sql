-- Painel Pessoal Norte Rios — seed inicial
-- Rode DEPOIS de schema.sql. Todo valor abaixo é uma transcrição literal do que
-- já existia hardcoded em js/app/data.js (catálogo) e em defaultState() de
-- js/app/state.js (estado inicial) — nenhum dado foi inventado.

-- ======================= CATÁLOGO =======================

insert into naturezas (slug, rotulo) values
('planejamento','Planejamento'),
('producao','Produção técnica'),
('monitoramento','Monitoramento'),
('projetos','Projetos'),
('formacoes','Formações e treinamentos'),
('articulacao','Articulação'),
('documentacao','Documentação'),
('relatorios','Relatórios'),
('dados','Dados e indicadores'),
('sistemas','Sistemas e ferramentas'),
('pdi','PDI'),
('rotina','Rotina'),
('janela','Janela');

insert into semana_dias (id, nome, foco, cor, ordem) values
('seg','Segunda','Planejamento e prioridades','var(--verde)',1),
('ter','Terça','Produção técnica e formações','var(--laranja)',2),
('qua','Quarta','Monitoramento e PDI','var(--teal)',3),
('qui','Quinta','Execução de projetos e sistemas','var(--amarelo)',4),
('sex','Sexta','Consolidação e PDI','var(--laranja)',5);

insert into semana_blocos (id, dia_id, ordem, hora, tarefa, natureza_slug, bloqueado, almoco) values
('seg1','seg',0,'9h às 9h30','Abertura da semana. Revisar demandas, consultar prazos, definir prioridades, verificar agenda e organizar a semana.','rotina',false,false),
('seg2','seg',1,'9h30 às 11h30','Consolidação do cronograma da Plataforma IMERSA e do calendário formativo do mês.','planejamento',false,false),
('seg3','seg',2,'11h30 às 13h','Organização da agenda de formações e revisão dos registros no Drive e no Sistema de Demandas.','documentacao',false,false),
('lunch1','seg',3,null,null,null,false,true),
('seg4','seg',4,'14h às 16h','Produção técnica de documentos e pareceres, ou elaboração de cronograma de evento quando aplicável a partir de novembro.','producao',false,false),
('seg5','seg',5,'16h às 17h30','Disponibilidade para reuniões técnicas com municípios e parceiros, quando solicitadas para escuta, ação formativa, monitoramento ou orientação. Sem solicitação, segue com articulação por e-mail e organização de pendências.','articulacao',false,false),
('seg6','seg',6,'17h30 às 18h','Janela para demandas e ajustes.','janela',false,false),

('ter1','ter',0,'9h às 11h','Elaboração de planos de trabalho, cronogramas, roteiros e instrumentos das formações internas e externas.','producao',false,false),
('ter2','ter',1,'11h às 13h','Produção e revisão de materiais formativos, pareceres, diagnósticos e documentos pedagógicos.','producao',false,false),
('lunch2','ter',2,null,null,null,false,true),
('ter3','ter',3,'14h às 16h','Sprint quinzenal de desenvolvimento de ferramentas e sistemas de apoio ao setor.','sistemas',false,false),
('ter4','ter',4,'16h às 17h','Coordenação de formadores. Alinhamento de objetivos, público, metodologia, materiais e prazos.','formacoes',false,false),
('ter5','ter',5,'17h às 18h','Janela para demandas e ajustes.','janela',false,false),

('qua1','qua',0,'9h às 11h','Revisão de instrumentos de inscrição, frequência e avaliação. Consolidação de dados quantitativos e qualitativos.','monitoramento',false,false),
('qua2','qua',1,'11h às 13h','Devolutivas técnicas a formadores e participantes sobre as ações da semana.','articulacao',false,false),
('lunch3','qua',2,null,null,null,false,true),
('qua3','qua',3,'14h às 16h','Disponibilidade para reuniões técnicas com equipe e municípios, quando solicitadas para escuta, ação formativa, monitoramento ou orientação, conforme a consultoria e assessoria prestada. Acompanhamento das Atas de Formação de Pacajá e Novo Repartimento.','articulacao',false,false),
('qua4','qua',4,'16h às 18h','Bloco protegido de PDI. Cursos e estudos previstos.','pdi',true,false),

('qui1','qui',0,'9h às 11h','Condução da Plataforma IMERSA. Cadastro de equipe pedagógica, formadores, conteúdos e inscrições.','projetos',false,false),
('qui2','qui',1,'11h às 13h','Execução operacional do Ciclo Formativo e Escola de Gestores. Mobilização, matrícula e configuração da ImersA.','projetos',false,false),
('lunch4','qui',2,null,null,null,false,true),
('qui3','qui',3,'14h às 15h30','Continuação do sprint. Testes e documentação de uso de cada ferramenta entregue.','sistemas',false,false),
('qui4','qui',4,'15h30 às 17h','Acompanhamento de pendências e prazos. Atualização sobre legislação e indicadores educacionais relevantes.','dados',false,false),
('qui5','qui',5,'17h às 18h','Janela para demandas e ajustes.','janela',false,false),

('sex1','sex',0,'9h às 11h','Consolidação do relatório mensal de atividades, quando aplicável, e organização de evidências do trimestre.','relatorios',false,false),
('sex2','sex',1,'11h às 12h30','Atualização do Drive, do painel de acompanhamento e do Sistema de Demandas. Avaliação dos fluxos do setor.','dados',false,false),
('sex3','sex',2,'12h30 às 13h','Encerramento da semana. Verificar entregas concluídas, registrar pendências, atualizar monitoramentos, organizar evidências, preparar a semana seguinte.','rotina',false,false),
('lunch5','sex',3,null,null,null,false,true),
('sex4','sex',4,'14h às 16h','Janela para demandas e ajustes, ou produção técnica remanescente.','janela',false,false),
('sex5','sex',5,'16h às 18h','Bloco protegido de PDI. Cursos e estudos previstos.','pdi',true,false);

insert into encontros_gestores (id, data, mes_chave, data_label, dia_semana, horario, publico, encontro_label, is_seminario) values
('eg1','2026-09-15','set','15 de setembro','terça-feira','9h às 12h','Técnicos da SEMED','Encontro 1 de 4',false),
('eg2','2026-09-17','set','17 de setembro','quinta-feira','9h às 12h','Diretores e vice-diretores','Encontro 1 de 3',false),
('eg3','2026-09-22','set','22 de setembro','terça-feira','14h às 17h','Coordenadores pedagógicos','Encontro 1 de 3',false),
('eg4','2026-10-06','out','6 de outubro','terça-feira','9h às 11h','Técnicos da SEMED','Encontro 2 de 4',false),
('eg5','2026-10-20','out','20 de outubro','terça-feira','14h às 16h','Técnicos da SEMED','Encontro 3 de 4',false),
('eg6','2026-10-22','out','22 de outubro','quinta-feira','9h às 12h','Diretores e vice-diretores','Encontro 2 de 3',false),
('eg7','2026-10-27','out','27 de outubro','terça-feira','14h às 17h','Coordenadores pedagógicos','Encontro 2 de 3',false),
('eg8','2026-11-05','nov','5 de novembro','quinta-feira','9h às 11h','Técnicos da SEMED','Encontro 4 de 4',false),
('eg9','2026-11-12','nov','12 de novembro','quinta-feira','9h às 12h','Diretores e vice-diretores','Encontro 3 de 3',false),
('eg10','2026-11-17','nov','17 de novembro','terça-feira','14h às 17h','Coordenadores pedagógicos','Encontro 3 de 3',false),
('eg11','2026-12-04','dez','4 de dezembro','sexta-feira','8h às 16h','Todos os públicos, presencial em Pacajá','Seminário de Integração',true);

insert into meses (chave, rotulo, nota, inicio, durante, fim, ordem) values
('set','Setembro','O planejamento das Jornadas Pedagógicas ainda não entra em setembro.',
 'Estruturação do cronograma da Plataforma IMERSA, elaboração do calendário formativo do mês, mapeamento do backlog de ferramentas para os sprints ágeis e governança do Ciclo Formativo, com protocolo de registro e checklist tecnológico.',
 'Mobilização e matrícula da plataforma ImersA, condução das primeiras ações formativas do calendário, sprints de desenvolvimento de ferramentas e início dos cursos do Eixo A do PDI.',
 'Fechamento do relatório mensal de atividades até o quinto dia útil de outubro, avaliação dos fluxos do setor, consolidação da frequência da ImersA de setembro e organização de evidências para outubro.',
 1),
('out','Outubro','O planejamento das Jornadas Pedagógicas ainda não entra em outubro.',
 'Revisão das demandas em aberto, definição de prioridades do mês, verificação dos projetos em andamento e organização da agenda de formações.',
 'Execução plena das formações e da IMERSA, sprints de ferramentas, entrada dos Eixos C e G do PDI e acompanhamento das Atas de Formação de Pacajá e Novo Repartimento.',
 'Fechamento do relatório mensal, consolidação da frequência da ImersA de outubro, avaliação dos fluxos do setor e organização de evidências para novembro.',
 2),
('nov','Novembro','A partir de novembro, a frente de Jornadas Pedagógicas entra gradualmente, apenas nas etapas iniciais previstas para este trimestre.',
 'Revisão das demandas em aberto e definição de prioridades, e início do levantamento preliminar das Jornadas Pedagógicas 2027.1, com os primeiros alinhamentos junto aos setores envolvidos.',
 'Continuidade das formações e da IMERSA, entrada do Eixo B do PDI, e primeiros passos do planejamento das Jornadas Pedagógicas: definição de necessidades, programação preliminar, formadores, logística pedagógica, materiais e instrumentos.',
 'Síntese trimestral da Plataforma IMERSA, relatório executivo do Ciclo Formativo até 11 de dezembro, fechamento dos relatórios do trimestre, relatório trimestral consolidado e avanço registrado do PDI.',
 3);

insert into bimestre_itens (ordem, objetivo, evidencia, sucesso, proximo_passo) values
(0,'Execução do cronograma da Plataforma IMERSA','Registros da plataforma e planilha de acompanhamento','Plano de condução atualizado e sem pendências em aberto','Ajustar seleção de formadores e conteúdos do próximo período'),
(1,'Atas de Formação de Pacajá e Novo Repartimento','Atas e registros no Sistema de Demandas','Prazos cumpridos e pendências resolvidas','Encaminhamentos aos municípios e formadores quando necessário'),
(2,'Fluxos mapeados e ferramentas entregues','Backlog, protótipos e documentação de uso','Ao menos um fluxo aperfeiçoado e ferramentas testadas','Priorizar o próximo item do backlog'),
(3,'Progresso do PDI nos eixos A, B, C e G','Certificados, materiais e roteiros produzidos','Cursos concluídos conforme a trilha prevista','Manter ritmo ou reforçar o bloco de estudo'),
(4,'Devolutivas técnicas realizadas','Registros e sínteses das devolutivas','Entregas acompanhadas com devolutiva registrada','Reforçar acompanhamento onde houver atraso'),
(5,'Presença nos encontros online da Escola de Gestores, Pacajá','Frequência e memória de cada encontro','Nenhuma ausência nos dez encontros previstos entre setembro e novembro','Confirmar presença no próximo encontro agendado');

-- frentes = união de FRENTES (obrigatorio) + TRIMESTRE (demais campos), mesmo n/nome/peso nos dois arrays originais
insert into frentes (n, nome, peso, obrigatorio, meta, acoes, produto, prazo, evidencia, resultado) values
(1,'Plataforma IMERSA e Setor de Formações',12,false,'Plataforma consolidada e setor fortalecido','Planejar, conduzir e monitorar a IMERSA','Plano de condução e cronograma estruturados','Até 1 de dezembro','Registros da plataforma e planilha de acompanhamento','Síntese trimestral com resultados, pendências e melhorias'),
(2,'Ações formativas do trimestre',12,false,'Calendário formativo interno e externo cumprido','Elaborar planos, cronogramas e roteiros das formações','Planos, cronogramas e relatórios pós ação','Até 31 de dezembro','Planos, cronogramas e roteiros','Fechamento dos relatórios na tabela de monitoramento'),
(3,'Coordenação de formadores e devolutivas',9,false,'Cem por cento das entregas acompanhadas com devolutiva','Articular formadores e estruturar devolutivas','Pautas, atas e sínteses de devolutivas','Até 1 de dezembro','Registros e sínteses das devolutivas','Consolidação das devolutivas do trimestre'),
(4,'Avaliação, monitoramento e evidências',8,false,'Documentos revisados dentro dos prazos pactuados','Revisar instrumentos e consolidar dados','Pareceres e registros no Sistema de Demandas','Contínuo','Atas, pareceres e respostas encaminhadas','Relatório trimestral das ações do setor por mês e por formação'),
(5,'Produção técnica de documentos',10,false,'Diagnósticos, planos e materiais validados','Produzir e revisar documentos pedagógicos','Documentos técnicos e versões revisadas','Contínuo','Fontes oficiais consultadas e pareceres','Orientações fundamentadas mantidas atualizadas'),
(6,'Organização documental e processos',9,false,'Ao menos um fluxo prioritário aperfeiçoado','Manter Drive e registros atualizados, mapear gargalos','Painel de acompanhamento e fluxos documentados','Até 1 de dezembro','Drive padronizado e Sistema de Demandas','Avaliação dos fluxos ao final de cada mês'),
(7,'Ciclo Formativo, Escola de Gestores e ImersA',10,true,'Ciclo formativo executado com governança e mobilização concluídas','Conduzir matrícula, configuração e frequência da ImersA. Presença obrigatória em todos os dez encontros online da Escola de Gestores, de setembro a novembro, e no Seminário de Integração presencial em 4 de dezembro','Base de inscritos saneada e relatórios de frequência','Até 11 de dezembro','Ata da governança e relatórios mensais de frequência','Relatório executivo do ciclo entregue'),
(8,'Ferramentas e sistemas com metodologias ágeis',8,false,'Ao menos duas ferramentas desenvolvidas, testadas e implementadas','Mapear processos e desenvolver em sprints curtos','Backlog, protótipos e documentação de uso','Final do trimestre','Registros de teste com o setor','Ajustes finais e documentação entregue'),
(9,'Planejamento de eventos educacionais',7,false,'Cem por cento dos eventos previstos com plano e checklist prontos','Elaborar cronograma, briefing e logística de cada evento. Jornadas Pedagógicas somente a partir de novembro','Plano de evento, cronograma e materiais de divulgação','Conforme calendário','Atas de alinhamento com municípios','Checklist pronto com pelo menos quinze dias de antecedência'),
(10,'Estudos, PDI e desenvolvimento pessoal',8,false,'Registro mensal de estudos e ao menos uma síntese aplicada','Participar dos cursos previstos no PDI e sistematizar aprendizados','Certificados e materiais de aplicação prática','Contínuo, registro mensal','Certificados e notas técnicas','Síntese de aprendizados compartilhada'),
(11,'Consolidação de relatórios mensais',7,false,'Relatório mensal entregue até o quinto dia útil do mês seguinte','Coletar, organizar e consolidar as atividades do mês','Relatórios mensais e relatório trimestral consolidado','Final do mês 3','Relatórios no drive e no sistema','Relatório trimestral consolidado entregue');

insert into eixos (letra, nome, prioridade, cor, aplicacao) values
('A','Eixo A. Inteligência Artificial na Educação','Prioridade alta, quartas feiras','var(--verde)','Produção progressiva. Banco de referências e material de estudo sobre IA na educação a partir dos cursos de fundamentos. Roteiro de formação com slides e exemplos práticos a partir do curso de IA generativa. Oficina piloto de IA aplicada à prática docente para a equipe interna a partir do mês 4, pronta para se tornar formação externa.'),
('C','Eixo C. Educação Especial e Inclusiva','Prioridade alta, sextas feiras, outubro a dezembro','var(--teal)','Produção progressiva. Material de apoio sobre Desenho Universal para a Aprendizagem a partir do primeiro curso. Banco de exemplos práticos de tecnologia assistiva a partir do segundo curso. Estrutura de uma futura formação sobre Educação Especial Inclusiva para professores do ensino comum a partir do terceiro curso.'),
('G','Eixo G. Dados, Excel e Dashboards','Prioridade alta, sextas feiras, outubro e novembro','var(--amarelo)','Aprimoramento do painel e da planilha de acompanhamento do setor com fórmulas e tabelas dinâmicas a partir do primeiro curso. Leitura crítica de indicadores incorporada ao relatório trimestral a partir dos cursos de análise de dados.'),
('B','Eixo B. Ferramentas com IA generativa','Prioridade alta, sextas feiras, a partir do mês 3','var(--laranja)','Aplicação direta no desenvolvimento de ferramentas do setor. Cada sprint passa a incorporar agentes e automações estudados, com documentação mais robusta de cada entrega.');

insert into eixos_cursos (eixo_letra, ordem, mes_label, curso) values
('A',0,'Mês 1','FluênciA Educadores (ENAP, 3h)'),
('A',1,'Mês 1','Inteligência Artificial na Educação, Fundamentos (MEC Avamec, 20h)'),
('A',2,'Mês 2','IA na prática docente (MEC Avamec, 30h)'),
('A',3,'Mês 2','Metodologias, tecnologias digitais e IA (MEC Avamec, 30h)'),
('A',4,'Mês 3','IA generativa na educação (MEC Avamec, 40h)'),
('A',5,'Mês 3','Gerazine, IA generativa na curadoria e criação de recursos (MEC Avamec, 40h)'),
('A',6,'Mês 4','IA, uso criativo para transformar a aprendizagem (MEC Avamec, 60h)'),
('A',7,'Meses 4 e 5','IA na prática docente, uso ético e pedagógico, ensino fundamental (MEC Avamec Unesco, 80h)'),
('A',8,'Meses 5 e 6','IA na prática docente, uso ético e pedagógico, ensino médio (MEC Avamec Unesco, 80h)'),
('A',9,'A partir do mês 6','Formação para Professores em Inteligência Artificial (MEC Avamec, 180h, continua no próximo trimestre)'),
('C',0,'Mês 2','Desenho Universal para a Aprendizagem para Professores (IFB, 20h)'),
('C',1,'Meses 2 e 3','Desenho Universal para a Aprendizagem e Tecnologia Assistiva (Fundação Roberto Marinho, 6 módulos)'),
('C',2,'Meses 3 e 4','Formação Continuada, Educação Especial Inclusiva (MEC Avamec UFG, 80h)'),
('G',0,'Mês 2','Excel Avançado (ENAP, 30h)'),
('G',1,'Meses 2 e 3','Análise de dados como suporte à tomada de decisão (ENAP)'),
('G',2,'Mês 3','Análise de dados, uma leitura crítica das informações (ENAP)'),
('B',0,'Mês 3','Criando Agentes com Copilot Studio para Microsoft 365 (ENAP, 1h)'),
('B',1,'Mês 3','FluênciA em Inteligência Artificial (Fundação Bradesco, 4h)'),
('B',2,'Mês 4','Soluções de IA no GitHub (Fundação Bradesco, 15h)'),
('B',3,'Meses 4 e 5','Trilhas Power Platform, Power Apps e Power Automate (Microsoft Learn, carga livre)');

insert into eixos_media (nome, prioridade, ordem) values
('Eixo D. Gestão de Projetos','Média',0),
('Eixo I. Design Instrucional e Andragogia','Média',1),
('Eixo F. LGPD e Proteção de Dados','Média baixa',2),
('Eixo E. Gestão Documental e Processos','Média baixa',3),
('Eixo H. Legislação e Políticas Públicas','Média baixa',4);

insert into mapa_entregas (id, acao, entrega, periodicidade, evidencia, meta, ordem) values
('m1','Condução da Plataforma IMERSA','Plano de condução e cronograma estruturados','Semanal','Registros da plataforma','Meta 1',0),
('m2','Elaboração de planos e roteiros de formação','Calendário formativo cumprido','Semanal','Planos e cronogramas','Meta 2',1),
('m3','Coordenação de formadores','Devolutivas técnicas registradas','Semanal','Registros de devolutivas','Meta 3',2),
('m4','Revisão de instrumentos e dados','Relatório trimestral das ações do setor','Semanal','Pareceres e registros','Meta 4',3),
('m5','Produção de documentos pedagógicos','Orientações atualizadas','Semanal','Documentos técnicos','Meta 5',4),
('m6','Atualização do Drive e do Sistema de Demandas','Fluxo prioritário aperfeiçoado','Semanal','Painel de acompanhamento','Meta 6',5),
('m7','Execução do Ciclo Formativo e da ImersA','Relatório executivo do ciclo','Semanal','Relatórios de frequência','Meta 7',6),
('m8','Sprint de ferramentas e sistemas','Ferramentas desenvolvidas e documentadas','Quinzenal','Backlog e protótipos','Meta 8',7),
('m9','Planejamento de eventos, Jornadas a partir de novembro','Checklist do evento pronto','Pontual','Plano de evento','Meta 9',8),
('m10','Estudo dos cursos do PDI','Síntese de aprendizados aplicados','Semanal','Certificados e materiais','Meta 10',9),
('m11','Consolidação do relatório mensal','Relatório trimestral consolidado','Mensal','Relatórios no sistema','Meta 11',10),
('m12','Presença nos encontros online da Escola de Gestores, Pacajá','Frequência confirmada em todos os encontros e no Seminário presencial','Fixo, calendário set a nov, mais 4 de dezembro','Registro de frequência e memória dos encontros','Meta 7',11);

insert into status_opts (valor, rotulo, ordem) values
('afazer','A fazer',0),
('andamento','Em andamento',1),
('concluido','Concluido',2),
('aguardando','Aguardando',3),
('bloqueado','Bloqueado',4);

-- ======================= ESTADO INICIAL =======================
-- Transcrição literal de defaultState() em js/app/state.js.
-- pdi_curso_atual = PDI_CURSO_OPTS[1].v, ou seja, o 2º curso do Eixo A
-- (a mesma regra "PDI_CURSO_OPTS[1] || PDI_CURSO_OPTS[0]" do código original).

insert into painel_estado (id, pdi_curso_atual, pdi_percent, prioridades, pendencias, observacoes, mes_ativo) values
(1,
 'A|Inteligência Artificial na Educação, Fundamentos (MEC Avamec, 20h)',
 15,
 'Concluir a Ficha PITT PDI e avançar no curso Inteligência Artificial na Educação, Fundamentos.',
 '',
 '',
 'out');

insert into checks (item_id, marcado) values
('eg1', true),
('eg2', true);

insert into entrega_status (mapa_id, status) values
('m1','andamento'),
('m2','andamento'),
('m3','afazer'),
('m4','andamento'),
('m5','andamento'),
('m6','andamento'),
('m7','afazer'),
('m8','afazer'),
('m9','aguardando'),
('m10','andamento'),
('m11','afazer'),
('m12','andamento');

-- `edits` fica vazia por padrão (defaultState().edits === {}) — nenhuma linha a inserir.
