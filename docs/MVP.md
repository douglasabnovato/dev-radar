# MVP — dev-radar

> Revisto em 09/11/2026 (ciclo de 07/11/2026), em 10/11/2026 (critério 10) em 15/11/2026 (critérios 2, 8, 9 e 11) em 16/11/2026, 12h01 e 14h39 (critério 9, com os alertas do Dependabot e a ADR-006) e em 18/11/2026, 19h52 (critérios 9 e 10, conferidos pela API, e #66 em "Fora do MVP"), e em 25/11/2026 (critério 8 a 320 px, #88), e em 26/11/2026 (critérios 6 e 11, os testes da tela do mapa no app, #85). Nível: **Estudo (N1)**. Os critérios 5 e 7 não se aplicam ao N1 e saem da conta. Testado no Windows, com Node 24, no clone da `feature/2026-11-16`. Não houve teste com pessoas nem em aparelho real.

**Resumo:** 10 de 10 aplicáveis atendidos

**Finalizado:** sim — em 18/11/2026 o Dependabot tem 1 alerta aberto, o `minimatch` do app móvel, na [ADR-006](ARQUITETURA.md#adr-006--aceitar-os-alertas-de-desenvolvimento-do-dependabot), porque não entra no app. A `master` exige PR e os 4 jobs do CI (#62). Falta o responsável: decidir a publicação (#61) e abrir o app num aparelho (#69).

| # | Critério | Como verificar | Situação | Evidência e data |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem procura devs por tecnologia os encontra no mapa. | README, 09/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção "Hipótese", com meta e o "saberemos quando"; sem validação com pessoas (N1: a meta é o fluxo rodar na tela e nos testes). | Seção "Hipótese", 15/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: no navegador, o formulário recebe a posição do navegador, cadastra o dev, mostra o cartão, recusa usuário inexistente com a mensagem da API e remove o dev com confirmação. A busca por tecnologia num raio de 10 km (rota `/search`, chamada direto na API, como o app faz) acha o dev perto e não acha a 130 km. A tela do app não foi aberta (sem aparelho). | `npm run test:e2e` em `web` (Playwright 1.65, Chromium local, API `npm run demo` em memória com perfil do GitHub simulado, dados de demonstração criados pelo teste): 1 passed, 09/11/2026; job `e2e` no CI |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção "Fora do MVP". | 09/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1). | Decisão 2 do processo |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: sem API, a web mostra o erro e "Tentar novamente"; sem localização, pede latitude e longitude; usuário inexistente e cota do GitHub com mensagem clara. No app, a tela do mapa avisa a localização negada, a busca sem tecnologia, a busca vazia, o erro de rede e o erro da API, o carregamento que para no fim e o aviso antigo que some numa nova busca (`Main.test.js`, com mapa, localização, API e socket simulados; #85). | `npm test` em `web` (3 passed) e `backend` (10 pass); `fluxo.e2e.js`, 15/11/2026; `npm test` em `mobile` (13 passed), 26/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1). `dev-radar.onrender.com` respondeu 404 em 09/11/2026. | `curl`, 09/11/2026; #61 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe (WCAG A e AA) sem violações no teste de navegador, em 3 estados (carregado, depois do cadastro e com o erro de usuário inexistente); o teste acha os campos pelos rótulos e o botão "Remover" pelo nome acessível; foco visível e sem rolagem em 375 px (ciclo de 02/11/2026). A web não tem tema escuro próprio, então a checagem no escuro não se aplica. Desde 25/11/2026, o fluxo roda também a 320 x 640 px (projeto `celular-320`, Pixel 7) com um usuário de 39 letras, o máximo do GitHub. Antes de cada axe, nos 3 estados e depois de remover, 3 medidas reprovam a rolagem lateral, o elemento além da borda direita ou da esquerda e o conteúdo escondido dentro de uma caixa. Elas acharam, e o #92 corrigiu, o cartão que ia a 419 px com o nome longo. Os alvos de toque do cartão (#93) e a margem do `#app` (#94) seguem abertos e não são falha da WCAG 1.4.10. | `cd web && npm run test:e2e`: 3 execuções, 1 passed em cada, 15/11/2026; job `e2e` no CI. A 320 px: run 45563108817 da `developer/sprint-2026-11-26` (commit `6cbd699`, merge do #92), `e2e` com 2 passed (1 teste x 2 projetos), 25/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Atende: API com mongoose 6.13.12 e `npm audit --omit=dev` 0; web sem alertas; o token do GitHub é opcional e só vai nos segredos da hospedagem. O Dependabot lista 1 alerta aberto, no `mobile/package-lock.json`, e 0 sem decisão: #621 `minimatch` 10.2.6 (médio, via `expo` → `@expo/fingerprint` 0.20.16), na [ADR-006](ARQUITETURA.md#adr-006--aceitar-os-alertas-de-desenvolvimento-do-dependabot), porque não entra no bundle do app; até o `@expo/fingerprint` 0.21.10 pede `minimatch` `^10.2.6`. O #620 `glob` saiu com os PRs #81 e #77, e o #613 `deepmerge` foi retirado pelo GitHub (a API responde 410, "withdrawn"). | `gh api "repos/douglasabnovato/dev-radar/dependabot/alerts?state=open&per_page=100"`, 18/11/2026 19h50: 1 aberto (#621, ADR-006). `npm audit --omit=dev`: 0 em `backend` e em `web`; 3 moderados em `mobile` (`--package-lock-only`), todos na cadeia do `minimatch`, 18/11/2026. Em 16/11/2026, em `mobile/`: `npx expo export --platform android --source-maps` ok, 960 módulos no bundle e 0 de `minimatch`, `glob`, `deepmerge` ou `@expo/fingerprint`; `npm audit --omit=dev`: 3 moderados, todos na cadeia `expo` → `@expo/fingerprint` → `minimatch` (ADR-006); `npm audit --omit=dev` em `backend`: 0, 16/11/2026 |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende: o workflow `CI` (jobs `backend`, `web`, `mobile` e `e2e`) roda em PR e push para `master` e `developer/**`; a `master` tem o ruleset `principal-protegida` ativo: exige PR e os jobs `backend`, `web`, `mobile` e `e2e` verdes, e bloqueia force push e exclusão. | `gh api repos/douglasabnovato/dev-radar/rules/branches/master`, 18/11/2026: `deletion`, `non_fast_forward`, `pull_request` e `required_status_checks` (`backend`, `e2e`, `mobile`, `web`); #62 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 10 na API, 3 na web, 13 no app (3 da configuração e 10 da tela do mapa, #85 e #100: os avisos, o carregamento, o socket, o aviso anunciado ao leitor de tela e os devs novos em tempo real), 1 de ponta a ponta no navegador; o CI também empacota o app para Android (`expo export`). | `npm test` em `backend` (10 pass) e `web` (3 passed), `npm run test:e2e` (1 passed), 15/11/2026; `npm test` em `mobile` (13 passed), 26/11/2026 |
| 12 | Documentação honesta | O README ensina a rodar | Atende: comandos conferidos com o `package.json`, inclusive `npm run demo` e `npm run test:e2e`; aviso de estudo; estado e próximos passos. | README, 09/11/2026 |

## Hipótese

Acreditamos que quem procura devs por tecnologia encontra alguém perto cadastrando só o usuário do GitHub e buscando pela tecnologia no mapa. Saberemos quando o fluxo cadastrar → achar na busca num raio de 10 km → remover passar no teste de navegador do CI, e quando uma pessoa de fora concluir o cadastro sem ajuda em até 1 minuto. Esse teste com pessoas ainda não foi feito.

Meta decidida pelo coordenador em 15/11/2026, revisável.

## Fora do MVP

Contas e mensagens. Distância de cada dev na busca (#66): funcionalidade nova, fora do nível N1 (18/11/2026).

## Neste ciclo (15/11/2026)

axe no teste de navegador, em 3 estados (#70); token opcional do GitHub (#65); mongoose 6.13.12; hipótese com meta.

## Ciclo de 07/11/2026

App migrado para o Expo 57 e React Navigation 7 (#63); fluxo principal percorrido no navegador com Playwright e job `e2e` no CI (#64); `npm run demo` sobe a API sem MongoDB.

## Histórico

- 25/11/2026: o critério 8 vale também a 320 px, com o usuário de 39 letras e as 3 medidas de corte (#92, run 45563108817, 2 passed). O cartão do dev cabe com o nome mais longo. Os alvos de toque (#93) e a margem (#94) ficaram em issues. O resumo segue em 10 de 10.
- 18/11/2026, 19h52: conferência pela API (#84). Critério 9 de 3 para 1 alerta aberto (#621, ADR-006); critério 10 com o `required_status_checks` dos 4 jobs; #66 em "Fora do MVP" (critério 4). Resumo e Finalizado sem mudança.
- 16/11/2026, 14h39: a ADR-006 registra os 2 alertas que não chegam à produção (`minimatch` e `deepmerge`), pela ordem do responsável. Critério 9 de Parcial para Atende; Resumo de 9 para 10 de 10; Finalizado de "não" para "sim".
- 16/11/2026, 12h01: o `glob` 13 saiu do app com o `@expo/fingerprint` 0.20.16 (PR #81, fecha com o merge na `master`); `minimatch` e `deepmerge` seguem na #78. Critério 9 segue Parcial; Resumo e Finalizado sem mudança.

### Tabela de 06/11/2026 (ciclo de 03/11/2026): 7 de 10 aplicáveis atendidos

| # | Critério | Como verificar | Situação | Evidência e data |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem procura devs por tecnologia os encontra no mapa. | README, 06/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: proposta na seção 2; sem validação com pessoas. | Seção 2 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Parcial: no navegador, sem API, só formulário e erro. O cadastro exige MongoDB; a API tem testes com repositório em memória. | #64 |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção 3. | 06/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1). | Decisão 2 do processo |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: sem API, a web mostra o erro e "Tentar novamente"; sem localização, pede latitude e longitude; usuário inexistente no GitHub dá 404, GitHub fora dá 503 e cota esgotada dá 429 com o tempo de espera. | `backend/tests/api.test.js` (9 testes), `web/src/App.test.jsx`, 06/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1). O site respondeu 404 em 06/11/2026. | #61 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe sem violações; foco visível; sem rolagem em 375 px. | Ciclo de 02/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Parcial: API e web sem alertas no `npm audit --omit=dev`, mas o app móvel (Expo 43) concentra 6 alertas críticos e cerca de 60 altos do Dependabot. O `axios` do app subiu para 1.x neste ciclo; o resto exige migrar o Expo. O cache `mobile/.expo` saiu do Git. | `gh api .../dependabot/alerts`, 06/11/2026; #63 |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Parcial: CI roda em PR e push para `master` e `developer/**`, mas a `master` não tem proteção. | #62 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 9 na API, 3 na web, 2 no app. | CI do #60, 06/11/2026 |
| 12 | Documentação honesta | O README ensina a rodar | Atende: comandos conferidos com o `package.json` (web na porta 3000 pelo `vite.config.mjs`); aviso de estudo; seção de estado e próximos passos. | README, 06/11/2026 |

