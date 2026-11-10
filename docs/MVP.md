# MVP — dev-radar

> Revisto em 09/11/2026 (ciclo de 07/11/2026); critério 10 revisto em 10/11/2026. Nível: **Estudo (N1)**. Os critérios 5 e 7 não se aplicam ao N1 e saem da conta. Testado no Windows, com Node 24, no clone da `feature/2026-11-07`. Não houve teste com pessoas nem em aparelho real.

**Resumo:** 10 de 10 aplicáveis atendidos

**Finalizado:** sim — todos os critérios aplicáveis estão em "Atende". A proteção da `master` (#62) foi criada em 10/11/2026; a issue fecha no merge da `master`.

| # | Critério | Como verificar | Situação | Evidência e data |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem procura devs por tecnologia os encontra no mapa. | README, 09/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção "Hipótese"; sem validação com pessoas. | Seção "Hipótese", 09/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: no navegador, o formulário recebe a posição do navegador, cadastra o dev, mostra o cartão, recusa usuário inexistente com a mensagem da API e remove o dev com confirmação. A busca por tecnologia num raio de 10 km (rota `/search`, chamada direto na API, como o app faz) acha o dev perto e não acha a 130 km. A tela do app não foi aberta (sem aparelho). | `npm run test:e2e` em `web` (Playwright 1.65, Chromium local, API `npm run demo` em memória com perfil do GitHub simulado, dados de demonstração criados pelo teste): 1 passed, 09/11/2026; job `e2e` no CI |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção "Fora do MVP". | 09/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1). | Decisão 2 do processo |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: sem API, a web mostra o erro e "Tentar novamente"; sem localização, pede latitude e longitude; usuário inexistente e cota do GitHub com mensagem clara. | `npm test` em `web` (3 passed) e `backend` (9 pass); `fluxo.e2e.js`, 09/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1). `dev-radar.onrender.com` respondeu 404 em 09/11/2026. | `curl`, 09/11/2026; #61 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe sem violações; foco visível; sem rolagem em 375 px. O teste de ponta a ponta acha os campos pelos rótulos e o botão "Remover" pelo nome acessível. | Ciclo de 02/11/2026; `fluxo.e2e.js`, 09/11/2026 |
| 9 | Segurança e conformidade | Riscos decididos | Atende: o app saiu do Expo 43 / React Native 0.64 para o Expo 57 / React Native 0.86; `npm audit` no app foi para 0 crítico e 0 alto (restam 4 moderados e 8 baixos em ferramentas de build). API e web sem alertas. Na `master` o Dependabot ainda lista 6 críticos e 50 altos, todos do `mobile/package-lock.json` antigo; fecham quando a migração chegar à `master`. | `npm audit` em `mobile`, `web` e `backend --omit=dev`; `gh api .../dependabot/alerts?state=open`, 09/11/2026 |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende: o workflow `CI` (jobs `backend`, `web`, `mobile` e `e2e`) roda em PR e push para `master` e `developer/**`; a `master` tem o ruleset `principal-protegida` ativo (exige PR, bloqueia force push e exclusão). | `gh api repos/douglasabnovato/dev-radar/rulesets`, 10/11/2026: `principal-protegida`, `enforcement: active`; #62 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 9 na API, 3 na web, 3 no app, 1 de ponta a ponta no navegador; o CI também empacota o app para Android (`expo export`). | `npm test` (API 9 pass, web 3 passed, app 3 passed), `npm run test:e2e` (1 passed) e `npx expo export --platform android` (ok), 09/11/2026 |
| 12 | Documentação honesta | O README ensina a rodar | Atende: comandos conferidos com o `package.json`, inclusive `npm run demo` e `npm run test:e2e`; aviso de estudo; estado e próximos passos. | README, 09/11/2026 |

## Hipótese (proposta)

Praticar API, web e app móvel: cadastrar um dev pelo usuário do GitHub.

## Fora do MVP

Contas e mensagens.

## Neste ciclo (07/11/2026)

App migrado para o Expo 57 e React Navigation 7 (#63); fluxo principal percorrido no navegador com Playwright e job `e2e` no CI (#64); `npm run demo` sobe a API sem MongoDB.

## Histórico

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

