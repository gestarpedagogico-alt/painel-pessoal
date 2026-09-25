# Painel Pessoal — Norte Rios

Painel pessoal de execução profissional. Site estático modularizado (HTML, CSS e JS em arquivos separados), sem build e sem dependências de terceiros além das fontes do Google Fonts.

Acompanha:
- Início (prioridades, pendências, observações do dia)
- Semana (grade de horários de segunda a sexta)
- Mês / Bimestre / Trimestre (entregas e frentes de trabalho)
- PDI (plano de desenvolvimento individual)
- Mapa de entregas
- Indicadores
- Ranking das frentes de trabalho

## Como usar

O painel usa ES modules (`<script type="module">`), então **precisa ser servido por http(s)** — abrir `index.html`/`login.html` direto do disco (`file://`) não funciona, o navegador bloqueia o carregamento dos módulos. Para rodar localmente, sirva a pasta do projeto com qualquer servidor estático, por exemplo:

```
python -m http.server 8000
# ou: npx serve .
```

Depois acesse `http://localhost:8000/login.html`, entre com um e-mail autorizado, e você será redirecionado para `index.html`. Em produção, qualquer hospedagem estática (GitHub Pages, Netlify, etc.) serve normalmente por http(s).

O acesso exige um e-mail cadastrado na lista `ALLOWED_EMAILS`, no topo de `js/login.js`. Para autorizar ou remover alguém, edite essa lista diretamente no código. Essa verificação é feita só no navegador (sem backend), então serve para barrar acesso casual, não como segurança real.

O estado (marcações, textos livres, status das entregas) é salvo automaticamente no `localStorage` do navegador — não há mais sincronização em nuvem; cada navegador/dispositivo guarda o seu próprio estado.

## Estrutura

Ver [`CLAUDE.md`](./CLAUDE.md) para detalhes de arquitetura e organização dos arquivos.
