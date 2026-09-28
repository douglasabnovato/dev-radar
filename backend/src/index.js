/*
 * index.js · ponto de entrada: conecta ao MongoDB (URI do ambiente), sobe HTTP + WebSocket.
 */
const http = require('http');
const mongoose = require('mongoose');
const env = require('./config/env');
const { createApp } = require('./app');
const { setupWebsocket } = require('./websocket');
const repository = require('./repositories/mongoDevRepository');
const { createGithubService } = require('./services/githubService');

/* Valida a configuração, conecta e começa a ouvir. */
async function main() {
    if (!env.mongoUri) {
        throw new Error('Defina MONGODB_URI no arquivo .env (veja .env.example).');
    }
    await mongoose.connect(env.mongoUri);

    let notifier = { notifyNewDev: () => {} };
    const app = createApp({
        repository,
        github: createGithubService(),
        notifier: { notifyNewDev: (...args) => notifier.notifyNewDev(...args) },
        corsOrigin: env.corsOrigin,
        radiusMeters: env.searchRadiusMeters,
    });
    const server = http.createServer(app);
    notifier = setupWebsocket(server, { corsOrigin: env.corsOrigin });
    server.listen(env.port, () => console.log(`DevRadar API em http://localhost:${env.port}`));
}

main().catch((error) => {
    console.error('Falha ao iniciar:', error.message);
    process.exit(1);
});
/* fim de index.js */
