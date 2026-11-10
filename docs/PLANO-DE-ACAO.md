# Plano de ação — DevRadar

| # | Prioridade | Tarefa | Defeito | Critério | Esforço | Status |
|---|---|---|---|---|---|---|
| T01 | Must | Tirar a URI do MongoDB do código (`MONGODB_URI`) | D1 | C4, C9 | 1 | ✅ Feito |
| T02 | Must | Haversine correto com os dois pontos | D2 | C1 | 1 | ✅ Feito |
| T03 | Must | Validação (zod), GitHub via HTTPS com timeout, tratador de erros | D3 | C2, C4 | 2 | ✅ Feito |
| T04 | Must | Corrigir os erros do app móvel | D4 | C1 | 2 | ✅ Feito (validar no aparelho) |
| T05 | Should | Registro de conexões com remoção e CORS do Socket.IO | D5 | C8 | 1 | ✅ Feito |
| T06 | Should | Usuário único, tecnologias normalizadas, `timestamps` | D6 | C5 | 1 | ✅ Feito |
| T07 | Should | PUT e DELETE de dev | RF06 | C1 | 1 | ✅ Feito |
| T08 | Should | Web: estados, remoção, CRA 5/React 18, fonte e foco | D7 | C2, C3, C9 | 2 | ✅ Feito |
| T09 | Should | Testes: 8 na API, 3 na web | — | C6 | 2 | ✅ Feito |
| T10 | Must (usuário) | Trocar a senha do usuário do Atlas e restringir o acesso de rede; criar `.env` | D1 | C4 | 1 | ⏳ Com você |
| T11 | Must (usuário) | `git rm -r --cached mobile/.expo mobile/.expo-shared` | D8 | C9 | 1 | ⏳ Com você |
| T12 | Could | Expo SDK atual + React Navigation 6; login com GitHub | ADR-005 | C1, C4 | 3 | Roadmap |

## Ciclo de 03/11/2026

> Executado em 06/11/2026. Branch `feature/2026-11-06` → `developer/sprint-2026-11-12` → `master`. Nível: Estudo (N1), 10 critérios aplicáveis.

### Produto

**Problema e público.** Quem procura programadores por tecnologia quer vê-los perto de si, no mapa. Projeto de estudo da Semana Omnistack 10.

**Hipótese e meta.** Um dev se cadastra só com o usuário do GitHub e aparece na busca de quem está a até 10 km. Meta de estudo: fluxo completo na tela e nos testes.

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Sem token, a API do GitHub aceita 60 consultas por hora por IP; ao estourar, responde 403 ou 429 e informa quando a cota volta nos cabeçalhos `x-ratelimit-*` | Neste ciclo a API passou a responder 429 com o tempo de espera, em vez de "GitHub indisponível". O token opcional virou a #65 | [GitHub Docs: limites da API REST](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) |
| No MongoDB, `$near` com índice `2dsphere` mede em metros e ordena do mais perto ao mais longe; para receber a distância calculada, usa-se `$geoNear` com `distanceField` | A busca já usa `$near` com `$maxDistance`; mostrar a distância virou a #66 | [MongoDB: $nearSphere](https://www.mongodb.com/docs/manual/reference/operator/query/nearSphere/), [OneUptime: consultas com $near](https://oneuptime.com/blog/post/2026-03-31-mongodb-geospatial-near/view) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | CI nos PRs para a `developer` | Alto | Baixo | Este ciclo |
| 2 | `axios` 1.x no app (alertas altos) | Alto | Baixo | Este ciclo |
| 3 | Aviso claro quando a cota do GitHub acaba | Médio | Baixo | Este ciclo |
| 4 | Cache `.expo` fora do Git | Baixo | Baixo | Este ciclo |
| 5 | Migrar o Expo 43 | Alto | Alto | #63 |
| 6 | Fluxo completo na tela | Alto | Médio | #64 |
| 7 | Token opcional do GitHub | Médio | Baixo | #65 |
| 8 | Distância na busca | Médio | Baixo | #66 |
| 9 | Publicar ou ficar só local | Médio | Baixo | Responsável (#61) |
| 10 | Proteger a `master` | Alto | Baixo | Responsável (#62) |

**Fora do escopo.** Contas, mensagens, login com GitHub.

### Engenharia

**Arquitetura.** API Express em `backend/src/app.js`, com repositório trocável (`mongoDevRepository.js` com `$near` no índice `2dsphere`; repositório em memória nos testes) e `githubService.js` injetável. Tempo real em `websocket.js` (Socket.IO). Web em Vite + React (`web/src`); app em Expo 43 com mapa (`mobile/`).

**Riscos.**
- O app móvel está no Expo 43, sem suporte, e concentra os alertas críticos e altos (#63). O `axios` 1.x passou nos testes do app, mas não foi visto num aparelho.
- A cota de 60 consultas por hora ao GitHub acaba rápido num servidor compartilhado (#65).
- Sem proteção na `master`, um push direto entra sem CI (#62).

**Qualidade.**
- Testes: 9 na API (`node --test`, inclui a cota do GitHub), 3 na web (Vitest), 2 no app (Jest).
- CI: agora também em PR e push para `developer/**`.
- Acessibilidade: axe sem violações (ciclo de 02/11).
- Segurança: API e web sem alertas no `npm audit --omit=dev`; o app depende da #63.

**Definição de pronto.** `npm ci` e `npm test` em `backend`, `web` e `mobile`; `npm run build` na web; CI verde no PR; `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. CI nos PRs e pushes para `developer/**`; `mobile/.expo` fora do Git (já estava no `.gitignore`).
2. `axios` 0.24 → 1.x no app.
3. Resposta 429 com tempo de espera quando a cota do GitHub acaba, com teste.
4. `docs/MVP.md` com régua N1, critério 9 corrigido para "Parcial" (o app tinha alertas que a leitura anterior não contou) e critério 10 em "Parcial"; README com estado e próximos passos.

**Vira issue.** #61 e #62 (responsável); #63 a #66 (agente).

## Ciclo de 07/11/2026

> Executado em 09/11/2026. Branch `feature/2026-11-07` → `developer/sprint-2026-11-12` → `master` (o PR para a `master` fica com o responsável). Nível: Estudo (N1), 10 critérios aplicáveis. Antes: 7 de 10.

### Produto

**Problema e público.** Os mesmos do ciclo anterior: quem procura devs por tecnologia os encontra no mapa, num raio de 10 km.

**Hipótese e meta.** Cadastrar um dev pelo usuário do GitHub e achá-lo na busca. Meta deste ciclo: ver o fluxo rodar no navegador e tirar o app do Expo 43, que concentrava todos os alertas críticos e altos.

**O que a pesquisa trouxe.**

| Ideia | O que levamos para o projeto | Fonte |
|---|---|---|
| Desde o React Navigation 5 não existe `getParam`; os parâmetros vêm de `route.params`, e os novos substituem os antigos | `Profile.js` lê `route.params?.github_username`; a pilha virou `createNativeStackNavigator` | [Fórum freeCodeCamp: getParam](https://forum.freecodecamp.org/t/why-does-getparam-not-work/398949), [React Navigation: upgrading from 6.x](https://reactnavigation.org/docs/upgrading-from-6.x) |
| O texto do pedido de localização se define no plugin do `expo-location` (`locationWhenInUsePermission`) no `app.json` | Plugin com texto em português no `app.json` | [Expo: Location (SDK 57)](https://docs.expo.dev/versions/v57.0.0/sdk/location.md) |
| O Playwright simula a posição do navegador com `geolocation` e `permissions` | O teste de ponta a ponta cobre o preenchimento automático de latitude e longitude | [Playwright: web server](https://playwright.dev/docs/test-webserver), [Playwright: dialogs](https://playwright.dev/docs/dialogs) |

**Backlog priorizado (impacto × esforço).**

| Prioridade | Item | Impacto | Esforço | Destino |
|---|---|---|---|---|
| 1 | App no Expo 57 (zera críticos e altos) | Alto | Alto | Este ciclo (#63) |
| 2 | Fluxo principal no navegador, com teste no CI | Alto | Médio | Este ciclo (#64) |
| 3 | Abrir o app migrado num aparelho | Alto | Médio | #69 |
| 4 | axe no teste de ponta a ponta | Médio | Baixo | #70 |
| 5 | Token do GitHub e distância na busca | Médio | Baixo | #65, #66 |
| 6 | Mesclar, publicar e proteger a `master` | Alto | Baixo | Responsável (#68, #61, #62) |

**Fora do escopo.** Contas, mensagens, login com GitHub.

### Engenharia

**Arquitetura.** API Express com repositório injetado: Mongo em produção e, agora, `memoryDevRepository.js` compartilhado pelos testes e pela API de demonstração (`npm run demo`, com `DEMO_GITHUB=offline` para simular o GitHub). Web em Vite. App em Expo 57 com React Navigation 7 e entrada própria em `mobile/index.js`.

**Riscos.**
- Migração do app é troca de versão maior (Expo 43 → 57, React Native 0.64 → 0.86) e só foi verificada por testes e `expo export`, sem abrir as telas (#69).
- `react-native-maps` pode não rodar no Expo Go e exigir build de desenvolvimento.
- O perfil simulado da demonstração não testa a chamada real ao GitHub; ela segue coberta pelos testes do `githubService`.

**Qualidade.** API 9 testes, web 3, app 3, ponta a ponta 1 (Playwright 1.65), `expo export` no CI. `npm audit`: API e web 0; app 0 crítico e 0 alto.

**Definição de pronto.** `npm test` nos três pacotes, `npm run build` na web, `npm run test:e2e` e `npx expo export --platform android` verdes, CI verde no PR para a sprint, `docs/MVP.md` e README atualizados.

### Plano de ação

**Este ciclo executa.**
1. Migração do app para o Expo 57 e React Navigation 7, com `expo export` no CI (#63). Item de revisão no PR: troca de versão maior.
2. API de demonstração em memória e teste Playwright do fluxo principal, com job `e2e` no CI (#64).
3. `docs/MVP.md` com uma tabela só e README com o estado do ciclo.

**Vira issue.** #68 (mesclar, responsável), #69 (app num aparelho), #70 (axe no teste de ponta a ponta).
