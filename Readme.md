<h4 align="center">
  🚀 Dev Radar
</h4>

<p align="center">
  <img alt="Frontend" src="./devradar.png" width="100%">
</p>

<h1 align="center">
    <img alt="DevRadar" title="#delicinha" src="./devradar.svg" width="250px" />
</h1>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/Rocketseat/semana-omnistack-10">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/Rocketseat/semana-omnistack-10">
  
  <a href="https://github.com/Rocketseat/semana-omnistack-10/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Rocketseat/semana-omnistack-10">
  </a>

  <a href="https://github.com/Rocketseat/semana-omnistack-10/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/Rocketseat/semana-omnistack-10">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
</p>

<p align="center">
  <a href="#rocket-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-layout">Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-contribuir">Como contribuir</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

### 💻 Projeto

Construir o app inspirado no waze para localizar desenvolvedores na sua região.  
O Dev Radar é uma que segue alguns parâmetros para localizar desenvolvedores e assim conectar profissionais as demandas conforme os projetos. 💰

## :rocket: Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- HTML/CSS/Javascript
- ReactJS
- React Native
- Nodejs
- MongoDB
- Git/Github
- Yarn/Npm 

### 🚀 Ferramentas

- VSCode
- Git Bash
- Insomnia
- MongoDB Atlas
- MongoDB Compass

### 🔖 Layout

Você pode visualizar o layout do projeto através [desse link](https://www.figma.com/file).
É necessário ter conta no [Figma](https://figma.com) para acessá-lo.

## Configurar Ambiente

- nodejs
- chocolatey 
- npm
- yarn
- vscode
- extensões vscode: drácula e material icon theme

## Qual a proposta deste projeto - parte 1? Criando a base da aplicação 

- [x] backend com Nodejs 
- [x] regras de negócio 
- [x] conexão com banco de dados
- [x] envio de e-mail
- [x] comunicação com webservices
- [x] autenticação do usuário 
- [x] criptografia e segurança
- [x] Json a estrutura de dados para interligar o backend com o frontend 
- [x] `yarn init -y` : na pasta C:\douglasabnovato\rocketseat\omnistack-10\backend
- [x] `package.json` : arquivo de configuração
- [x] `yarn add express` : auxilia na criação de rotas
- [x] `node index.js`: executa nosso servidor
- [x] `npm init -y`: vou usar npm
- [x] `npm install nodemon - D`: restartar o servidor
- [x] Ferramenta Insomnia: configurar rest
- [x] Listar Usuários - GET: criar nova requisição
- [x] Métodos HTTP: get, post, put, delete
- [x] Tipos de parâmetros: query params (request.query: filtros, ordenação, paginação, ...), 
- [x] Tipos de parâmetros: route params (request.params: identificar um recurso na alteração ou remoção)
- [x] Tipos de parâmetros: body (dados para a criação ou alteração de um registro)
- [x] conectar com o bd - mongodb - não relacional - hospedagem na núvem com mongodb atlas 
- [x] Instalar o Mongoose: `npm install mongoose` 
- [x] Arquivos de rotas: `routes.js`
- [x] Biblioteca axios faz chamadas para outras API: `npm install axios`
- [x] MongoDB Compass: SGBD que permite visualizar o bd
- [x] DevController: index, show, store, update, destroy
- [x] SearchController
- [x] Iniciar o projeto backend: `npm run dev`
 
## Qual a proposta deste projeto - parte 2? Construindo a interface web 

- [x] Introdução do cenário de desenvolvimento: abordagem com framework e abordagem com js, html, css
- [x] Criar projeto: `npx create-react-app web`
- [x] Iniciar o projeto frontend web: `npm start`
- [x] Criado a estrutura dos elementos no App
- [x] Estilização do global.css
- [x] Estilização do Sidebar.css
- [x] Estilização do Main.css
- [x] Aplicar responsividade: quando aplicar, como aplicar
- [x] Função de Geolocalização
- [x] Instalação e configuração de extensão no backend: `cors`. Objetivo de permitir acessar o backend
- [x] Axios: `npm install axios` 
- [x] map para exibir a lista de devs
- [x] refatoração e estrutura de pastas
- [x] warning: não está adicionando dev: revisar o web: key no li para montar no frontend.
- [x] warning: não está adicionando dev: revisar o backend: e.preventDefault escrito errada.

## Qual a proposta deste projeto - parte 3? Desenvolvendo o app mobile 

- [x] Aplicação será construída com react native com expo
- [x] Instalar expo: `npm install -g expo-cli`
- [x] Criar o módulo: `expo init mobile --template blank`
- [x] Iniciar o projeto mobile: `npm start` 
- [x] `localhost:19002` e o abrir o qr com o app expo instalado.
- [x] alterando a versão do node para corrigir o warning
- [x] warnings e errors: [docs!](https://github.com/Rocketseat/expo-common-issues)
- [x] [docs expo](https://docs.expo.dev/)
- [x] MapsView: `expo install react-native-maps`
- [x] location: `expo install expo-location`
- [x] WebView: `expo install react-native-webview`

## Qual a proposta deste projeto - parte 4? Funcionalidades Avançadas 

- [x] no backend: Adicionar dependência da socket.io: `npm install socket.io`
- [x] no backend: Configuração do socket.io
- [x] no mobile: Adicionar dependência da socketio: `npm install socket.io-client`  
- [x] no mobile: Configuração do socket.io na página main, na função loadDevs

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](.github/LICENSE.md) para mais detalhes.

---

Feito com ♥ by [douglasabnovato!](https://www.linkedin.com/in/douglasabnovato/) :wave: 

Fonte do projeto: [Diego Fernandes - Rocketseat - Semana Omnistack 10.0 - dev radar](https://www.rocketseat.com.br/)
