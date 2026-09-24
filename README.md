# Painel Pessoal — Norte Rios

Painel pessoal de execução profissional, em um único arquivo HTML autocontido (sem build, sem dependências).

Acompanha:
- Início (prioridades, pendências, observações do dia)
- Semana (grade de horários de segunda a sexta)
- Mês / Bimestre / Trimestre (entregas e frentes de trabalho)
- PDI (plano de desenvolvimento individual)
- Mapa de entregas
- Indicadores
- Ranking das frentes de trabalho

## Como usar

Basta abrir `painel-norte-rios.html` diretamente no navegador. Não há instalação nem build.

O estado (marcações, textos livres, status das entregas) é salvo automaticamente no `localStorage` do navegador. Quando publicado como Claude Artifact, o próprio painel também republica uma nova versão de si mesmo a cada alteração, preservando o estado entre acessos.

## Estrutura

Ver [`CLAUDE.md`](./CLAUDE.md) para detalhes de arquitetura do arquivo.
