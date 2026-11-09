/*
 * demo.js · API de demonstração local: mesmas rotas e tempo real, com dados em memória e sem MongoDB.
 * Com DEMO_GITHUB=offline, o perfil do GitHub é simulado (para testes sem rede); sem ela, consulta o GitHub de verdade.
 */
const http = require('http');
const env = require('./config/env');
const { createApp } = require('./app');
const { setupWebsocket } = require('./websocket');
const { createMemoryRepository } = require('./repositories/memoryDevRepository');
const { createGithubService } = require('./services/githubService');
const { AppError } = require('./lib/errors');

/* Perfil simulado: "nao-existe" responde 404, como o GitHub. */
const offlineGithub = {
    async getUser(username) {
        if (username.toLowerCase() === 'nao-existe') throw new AppError('Usuário do GitHub não encontrado.', 404);
        const avatar = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54"><rect width="54" height="54" fill="#7D40E7"/></svg>')}`;
        return { login: username, name: `Dev ${username}`, avatar_url: avatar, bio: 'Perfil de demonstração.' };
    },
};

/* Sobe a API em memória. */
function startDemo() {
    if (process.env.NODE_ENV === 'production') throw new Error('O modo demonstração não roda em produção.');
    let notifier = { notifyNewDev: () => {} };
    const app = createApp({
        repository: createMemoryRepository(),
        github: process.env.DEMO_GITHUB === 'offline' ? offlineGithub : createGithubService(),
        notifier: { notifyNewDev: (...args) => notifier.notifyNewDev(...args) },
        corsOrigin: env.corsOrigin,
        radiusMeters: env.searchRadiusMeters,
    });
    const server = http.createServer(app);
    notifier = setupWebsocket(server, { corsOrigin: env.corsOrigin });
    server.listen(env.port, () => console.log(`DevRadar API de demonstração (em memória) em http://localhost:${env.port}`));
    return server;
}

if (require.main === module) startDemo();

module.exports = { startDemo };
/* fim de demo.js */
