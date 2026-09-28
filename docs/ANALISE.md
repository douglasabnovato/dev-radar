# Análise do projeto — DevRadar

> Data da análise: 27/09/2026 · Branch analisada: `master` · Grupo: **fullstack (API + web + mobile)**

## 1. Contexto de produto

| Item | Descrição |
|---|---|
| Problema | Encontrar desenvolvedores de uma tecnologia específica perto de você (para projetos, vagas ou comunidade) é difícil. |
| Público | Devs que querem aparecer no radar (cadastro na web) e quem procura devs por perto (app móvel com mapa). |
| Proposta de valor | Cadastro com um clique a partir do GitHub; busca por tecnologia num raio de 10 km; aviso em tempo real quando surge alguém novo na região. |
| Origem | Semana OmniStack 10 (Rocketseat), evoluído como portfólio. |
| Métricas (propostas) | Devs cadastrados por cidade; buscas com ≥ 1 resultado; tempo até o primeiro aviso em tempo real. |

## 2. Especificação de requisitos

| ID | Requisito | Situação encontrada |
|---|---|---|
| RF01 | Cadastrar dev pelo usuário do GitHub, tecnologias e posição. | Parcial: `name = login` referencia variável inexistente (quebra quando o perfil não tem nome); usuário inexistente derruba a requisição. |
| RF02 | Listar devs (web). | Atende, sem estados de carregando/erro/vazio. |
| RF03 | Buscar devs por tecnologia num raio de 10 km (mobile). | Atende no back-end; `techs` ausente derruba a requisição. |
| RF04 | Avisar em tempo real quem está perto e busca a tecnologia. | **Não atende**: `calculateDistance` usa `pointCoordinates` sem recebê-lo (ReferenceError em todo cadastro com cliente conectado) e a fórmula converte o ângulo duas vezes. |
| RF05 | App móvel com mapa, busca e perfil. | **Não compila**: erro de sintaxe (`enableHighAccuracy: true;`), `subscribeToNewDevs` não exportado, `createAppConteiner`, `YellowBox` removido, `WebView` importado do lugar errado, `latitiude`/`coordenates`. |
| RF06 | Atualizar e remover o próprio cadastro. | Não existe. |

## 3. Diagnóstico

| ID | Severidade | Onde | Defeito | Referência |
|---|---|---|---|---|
| D1 | **Crítica** | `backend/src/index.js` | String de conexão do MongoDB Atlas **com usuário e senha** no código e no histórico do Git. | OWASP A02/A07; CWE-798 |
| D2 | Alta | `utils/calculateDistance.js` | Parâmetro ausente e Haversine errado (`sin(deg2rad(dLon/2))`). | Fórmula de Haversine (distância de grande círculo) |
| D3 | Alta | controllers | Sem validação nem tratamento de erro: GitHub 404, `techs` vazio ou coordenadas inválidas geram rejeições não tratadas (no Node 15+ derrubam o processo). | Tratamento de erros; *fail fast* |
| D4 | Alta | mobile | App não compila (RF05). | — |
| D5 | Média | `websocket.js` | Conexões nunca removidas ao desconectar (vazamento de memória e envio para sockets mortos); sem CORS do Socket.IO para a web. | Gerência de recursos |
| D6 | Média | modelo | `github_username` sem índice único (corrida cria duplicatas); tecnologias sem normalização ("React" ≠ "react"). | Integridade; normalização de dados |
| D7 | Média | web | CRA 4 sem flag OpenSSL não inicia no Node 18+; fonte com URL quebrada (`https:// .googleapis.com`); `outline: 0` global; rótulos com contraste 2,3:1. | WCAG 2.4.7 e 1.4.3 |
| D8 | Baixa | repositório | `mobile/.expo/` versionado; `app.json` com `sdkVersion` 36 e Expo 43 instalado; `http://` para GitHub. | Higiene |

## 4. Critérios de MVP e nota atual

Pesos do grupo **fullstack**. Aprovação: média ≥ 7,0 e C1 e C4 ≥ 5.

| # | Critério | Peso | Nota atual | Justificativa |
|---|---|---|---|---|
| C1 | Núcleo de valor | 18% | 4 | Tempo real quebrado e mobile sem compilar. |
| C2 | Estados | 10% | 2 | Nenhum estado de erro/carregando/vazio. |
| C3 | Acessibilidade | 8% | 4 | Foco invisível e contraste baixo na web. |
| C4 | Segurança | 16% | 1 | D1. |
| C5 | Dados | 12% | 5 | Índice 2dsphere correto; sem unicidade nem normalização. |
| C6 | Testes | 10% | 0 | Nenhum. |
| C7 | Qualidade de código | 8% | 4 | Acoplamento direto ao Mongoose e ao axios; D2. |
| C8 | Desempenho | 6% | 6 | Busca geoespacial por índice; conexões em array O(n) sem limpeza. |
| C9 | Operação | 6% | 2 | Credenciais no código; porta fixa; sem `start`; web não inicia no Node atual. |
| C10 | Documentação | 6% | 5 | README de aula; sem execução nem contrato. |

**Nota atual: 3,10 / 10 — REPROVADO.**

## 5. Nota depois do ciclo de melhorias (27/09/2026)

| # | Critério | Antes | Depois | O que mudou |
|---|---|---|---|---|
| C1 | Núcleo de valor | 4 | 8 | Tempo real funcionando, atualizar/remover dev, mobile corrigido (validar no aparelho). |
| C2 | Estados | 2 | 8 | Web com carregando, erro com retry, vazio e mensagens da API; mobile com permissão negada, vazio e erro. |
| C3 | Acessibilidade | 4 | 8 | axe-core: 0 violações na web; rótulos de acessibilidade no mobile. |
| C4 | Segurança | 1 | 7 | URI por `.env`, validação zod, helmet, HTTPS no GitHub. Vai a 9 com a senha do Atlas trocada. |
| C5 | Dados | 5 | 8 | Usuário único (índice), tecnologias normalizadas, `timestamps`. |
| C6 | Testes | 0 | 7 | 8 testes de API/unidade + 3 de interface web. |
| C7 | Qualidade de código | 4 | 8 | Injeção de dependência (repositório, GitHub, notificador); Haversine correto. |
| C8 | Desempenho | 6 | 8 | Conexões em `Map` com remoção O(1); limites de resultado. |
| C9 | Operação | 2 | 7 | `.env.example`, `start`, `/health`, CRA 5. |
| C10 | Documentação | 5 | 8 | `docs/` e README com execução e contrato. |

**Nota depois: 7,68 / 10 — APROVADO.**
