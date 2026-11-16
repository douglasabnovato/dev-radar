# MVP — dev-radar

> Revisto em 09/11/2026 (ciclo de 07/11/2026), em 10/11/2026 (critério 10) em 15/11/2026 (critérios 2, 8, 9 e 11) e em 16/11/2026, 12h01 e 14h39 (critério 9, com os alertas do Dependabot e a ADR-006). Nível: **Estudo (N1)**. Os critérios 5 e 7 não se aplicam ao N1 e saem da conta. Testado no Windows, com Node 24, no clone da `feature/2026-11-16`. Não houve teste com pessoas nem em aparelho real.

**Resumo:** 10 de 10 aplicáveis atendidos

**Finalizado:** sim — dos 3 alertas do Dependabot no app móvel, 1 foi corrigido na sprint-19 e 2 estão na [ADR-006](ARQUITETURA.md#adr-006--aceitar-os-alertas-de-desenvolvimento-do-dependabot), porque não entram no app. A proteção da `master` (#62) foi criada em 10/11/2026; a issue fecha no merge da `master`.

| # | Critério | Como verificar | Situação | Evidência e data |
|---|---|---|---|---|
| 1 | Problema e público claros | Dá para explicar em uma frase | Atende: quem procura devs por tecnologia os encontra no mapa. | README, 09/11/2026 |
| 2 | Hipótese a validar | Existe uma aposta escrita, com meta | Atende: seção "Hipótese", com meta e o "saberemos quando"; sem validação com pessoas (N1: a meta é o fluxo rodar na tela e nos testes). | Seção "Hipótese", 15/11/2026 |
| 3 | Fluxo principal completo | Uma pessoa conclui sem ajuda | Atende: no navegador, o formulário recebe a posição do navegador, cadastra o dev, mostra o cartão, recusa usuário inexistente com a mensagem da API e remove o dev com confirmação. A busca por tecnologia num raio de 10 km (rota `/search`, chamada direto na API, como o app faz) acha o dev perto e não acha a 130 km. A tela do app não foi aberta (sem aparelho). | `npm run test:e2e` em `web` (Playwright 1.65, Chromium local, API `npm run demo` em memória com perfil do GitHub simulado, dados de demonstração criados pelo teste): 1 passed, 09/11/2026; job `e2e` no CI |
| 4 | Escopo enxuto | O que não entra está registrado | Atende: seção "Fora do MVP". | 09/11/2026 |
| 5 | Medição de uso | A métrica principal é coletada | Não se aplica (N1). | Decisão 2 do processo |
| 6 | Falhas tratadas | Erro, vazio e carregamento têm resposta clara | Atende: sem API, a web mostra o erro e "Tentar novamente"; sem localização, pede latitude e longitude; usuário inexistente e cota do GitHub com mensagem clara. | `npm test` em `web` (3 passed) e `backend` (10 pass); `fluxo.e2e.js`, 15/11/2026 |
| 7 | Desempenho aceitável | LCP de até 2,5 s no celular | Não se aplica (N1). `dev-radar.onrender.com` respondeu 404 em 09/11/2026. | `curl`, 09/11/2026; #61 |
| 8 | Acessibilidade básica | axe e teclado | Atende: axe (WCAG A e AA) sem violações no teste de navegador, em 3 estados (carregado, depois do cadastro e com o erro de usuário inexistente); o teste acha os campos pelos rótulos e o botão "Remover" pelo nome acessível; foco visível e sem rolagem em 375 px (ciclo de 02/11/2026). A web não tem tema escuro próprio, então a checagem no escuro não se aplica. | `cd web && npm run test:e2e`: 3 execuções, 1 passed em cada, 15/11/2026; job `e2e` no CI |
| 9 | Segurança e conformidade | Riscos decididos | Atende: API com mongoose 6.13.12 e `npm audit --omit=dev` 0; web sem alertas; o token do GitHub é opcional e só vai nos segredos da hospedagem. O Dependabot lista 3 alertas abertos, todos no `mobile/package-lock.json`, e 0 sem decisão. #620 `glob`: corrigido na sprint-19 (PR #81); fecha no merge na principal. #621 `minimatch` 10.2.6 (médio, via `@expo/fingerprint`) e #613 `deepmerge` 4.3.1 (baixo, via `jest`): na [ADR-006](ARQUITETURA.md#adr-006--aceitar-os-alertas-de-desenvolvimento-do-dependabot), porque não entram no bundle do app. | `gh api "repos/douglasabnovato/dev-radar/dependabot/alerts?state=open&per_page=100"`, 16/11/2026 14h39: 3 abertos (1 corrigido na sprint-19, 2 na ADR-006, 0 sem decisão). Em `mobile/`: `npx expo export --platform android --source-maps` ok, 960 módulos no bundle e 0 de `minimatch`, `glob`, `deepmerge` ou `@expo/fingerprint`; `npm audit --omit=dev`: 3 moderados, todos na cadeia `expo` → `@expo/fingerprint` → `minimatch` (ADR-006); `npm audit --omit=dev` em `backend`: 0, 16/11/2026 |
| 10 | Entrega confiável | CI verde antes de entrar na principal | Atende: o workflow `CI` (jobs `backend`, `web`, `mobile` e `e2e`) roda em PR e push para `master` e `developer/**`; a `master` tem o ruleset `principal-protegida` ativo (exige PR, bloqueia force push e exclusão). | `gh api repos/douglasabnovato/dev-radar/rulesets`, 10/11/2026: `principal-protegida`, `enforcement: active`; #62 |
| 11 | Testes dos fluxos críticos | Testes automatizados no CI | Atende: 10 na API, 3 na web, 3 no app, 1 de ponta a ponta no navegador; o CI também empacota o app para Android (`expo export`). | `npm test` em `backend` (10 pass) e `web` (3 passed), `npm run test:e2e` (1 passed), 15/11/2026 |
| 12 | Documentação honesta | O README ensina a rodar | Atende: comandos conferidos com o `package.json`, inclusive `npm run demo` e `npm run test:e2e`; aviso de estudo; estado e próximos passos. | README, 09/11/2026 |

## Hipótese

Acreditamos que quem procura devs por tecnologia encontra alguém perto cadastrando só o usuário do GitHub e buscando pela tecnologia no mapa. Saberemos quando o fluxo cadastrar → achar na busca num raio de 10 km → remover passar no teste de navegador do CI, e quando uma pessoa de fora concluir o cadastro sem ajuda em até 1 minuto. Esse teste com pessoas ainda não foi feito.

Meta decidida pelo coordenador em 15/11/2026, revisável.

## Fora do MVP

Contas e mensagens.

## Neste ciclo (15/11/2026)

axe no teste de navegador, em 3 estados (#70); token opcional do GitHub (#65); mongoose 6.13.12; hipótese com meta.

## Ciclo de 07/11/2026

App migrado para o Expo 57 e React Navigation 7 (#63); fluxo principal percorrido no navegador com Playwright e job `e2e` no CI (#64); `npm run demo` sobe a API sem MongoDB.

## Histórico

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

