# MVP — dev-radar

> Revisto em 06/11/2026 (ciclo de 03/11/2026). Nível: **Estudo (N1)**. Os critérios 5 e 7 não se aplicam ao N1 e saem da conta. Testado no Windows, com Node 24, no clone da `feature/2026-11-06`. Não houve teste com pessoas nem em aparelho real.

**Finalizado: não.** Faltam o critério 3 (fluxo na tela, #64) e o 9 (alertas do app móvel, #63). O critério 10 depende do responsável (#62).

## 1. Critérios: 7 de 10 aplicáveis atendidos

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

## 2. Hipótese (proposta)

Praticar API, web e app móvel: cadastrar um dev pelo usuário do GitHub.

## 3. Fora do MVP

Contas e mensagens.

## 4. Neste ciclo

CI nos PRs para `developer/**`; cache `.expo` fora do Git; `axios` 1.x no app; aviso de cota do GitHub (429), com teste; documentação e 6 issues (#61 a #66).
