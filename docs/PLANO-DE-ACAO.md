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
