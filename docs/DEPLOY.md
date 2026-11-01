# Deploy · DevRadar

Plano de ação para publicar a API e o front-end web do DevRadar em hospedagem gratuita.

## 1. Desafio

Publicar uma API Express + Socket.IO com MongoDB e um front React que usa a geolocalização do navegador, sem custo, com a senha do banco fora do código (ela já vazou no histórico do Git e precisa ser trocada).

## 2. Conteúdo

### Decisão de hospedagem

| Peça | Onde | Por quê |
|---|---|---|
| **Banco** | MongoDB Atlas, cluster gratuito M0 | Persistente e gratuito; índice geoespacial `2dsphere` suportado |
| **API** (`backend/`) | Render, serviço web gratuito (`dev-radar-api`) | Node com WebSocket, `MONGODB_URI` pedida no painel |
| **Web** (`web/`) | Render, site estático gratuito (`dev-radar`) | HTTPS (exigido pela geolocalização), CDN, não hiberna |
| **Mobile** (`mobile/`) | Fora deste deploy | Expo SDK 43 não abre no Expo Go atual; depende da atualização do SDK |

### Pontos de atenção

- **Senha vazada:** a URI antiga do MongoDB (com senha) está no histórico do Git. Trocar a senha no Atlas antes de publicar é obrigatório.
- **Network Access do Atlas:** o plano gratuito do Render não tem IP fixo, então o Atlas precisa aceitar `0.0.0.0/0`. A proteção passa a ser o usuário exclusivo do app com senha forte.
- A API dorme após 15 min sem acesso; o front mostra o erro com a mensagem da API enquanto ela acorda.

### O que foi ajustado para o deploy

| Mudança | Arquivo | Por quê |
|---|---|---|
| Blueprint com API e web (branch `master`) | `render.yaml` | Os dois serviços versionados e ligados por `VITE_API_URL` |
| Dependências da API atualizadas dentro das mesmas versões maiores | `backend/package-lock.json` | `npm audit` apontava 13 pacotes (2 críticos em `mongoose` e `socket.io-parser`); `npm audit fix` sem mudança de versão maior zerou tudo |
| `package-lock.json` do web regenerado | `web/package-lock.json` | Estava fora de sincronia e o `npm ci` do deploy falhava |
| Seção de hospedagem com links | `Readme.md` | Endereços, limitações e o status do mobile |

### Verificação feita antes da entrega

- API: `npm ci` limpo, 8 testes passando (repositório falso, sem banco real), `npm audit --omit=dev` sem vulnerabilidades.
- Web: `npm ci` limpo, 3 testes passando, build com `CI=true` compilado sem avisos.

## 3. Solução (passo a passo)

### Etapa 1 · Preparar o MongoDB Atlas

1. No Atlas, **Database Access**: trocar a senha do usuário `dbDevRadar` (ou criar um usuário novo só para este app) com senha forte.
2. **Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`).
3. **Database → Connect → Drivers**: copiar a URI no formato do `backend/.env.example`, com o banco `devradar`.

### Etapa 2 · Validar localmente (Git Bash)

1. `cd /c/ambiente-projeto/ser-mvp/dev-radar/backend`
2. Criar `.env` a partir do `.env.example` com a URI nova.
3. `npm ci && npm test && npm start` (deixe rodando)
4. Em outro terminal: `cd ../web && npm ci && npm test && npm start`
5. Cadastrar um dev pelo usuário do GitHub e ver o card na lista.

### Etapa 3 · Subir para o GitHub (branch `master`)

1. `cd /c/ambiente-projeto/ser-mvp/dev-radar`
2. `git rm -r --cached mobile/.expo mobile/.expo-shared` (configuração local do Expo)
3. `git status` (nenhum `.env` pode aparecer)
4. `git add -A`
5. `git commit -m "fix(security): MONGODB_URI por env, Haversine, zod, PUT/DELETE, React 18, dependências seguras e deploy no Render"`
6. `git push`

### Etapa 4 · Criar os serviços no Render

1. Entrar em **render.com** com o GitHub e autorizar o repositório `dev-radar`.
2. **New → Blueprint** e escolher `douglasabnovato/dev-radar`.
3. O Render pede `MONGODB_URI`: colar a URI da Etapa 1.
4. **Apply** e acompanhar os **Logs** da API até aparecer `DevRadar API em http://localhost:10000`.
5. Se o endereço da API não for `https://dev-radar-api.onrender.com`, abrir o serviço `dev-radar` → **Environment**, corrigir `VITE_API_URL` e fazer **Manual Deploy → Deploy latest commit**.

### Etapa 5 · Conferir no ar

1. `https://<endereço-da-api>/health` responde `{"status":"ok"}`.
2. Abrir o web, permitir a localização e cadastrar um dev pelo usuário do GitHub.
3. O card aparece com avatar, bio e tecnologias.
4. `https://<endereço-da-api>/search?latitude=...&longitude=...&techs=react` devolve os devs no raio de 10 km.

### Etapa 6 · Fechar

1. Se os endereços reais forem diferentes, corrigir o `Readme.md` e o `render.yaml`, commit e push.
2. No GitHub, **About → Website**: colar a URL do web.
3. Mobile: quando o Expo SDK for atualizado, apontar `expo.extra.apiUrl` em `mobile/app.json` para a URL da API.
