/*
 * app.js · monta o Express (helmet, CORS, JSON limitado, rotas e erros) com dependências injetadas.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createRoutes } = require('./routes');
const { createDevController } = require('./controllers/DevController');
const { createSearchController } = require('./controllers/SearchController');

/* Cria a aplicação; repository, github e notifier vêm de fora (Mongo/GitHub reais ou fakes nos testes). */
function createApp({ repository, github, notifier, corsOrigin = '*', radiusMeters = 10000 }) {
    const app = express();
    app.disable('x-powered-by');
    app.use(helmet());
    app.use(cors({ origin: corsOrigin }));
    app.use(express.json({ limit: '10kb' }));

    app.use(createRoutes({
        devController: createDevController({ repository, github, notifier }),
        searchController: createSearchController({ repository, radiusMeters }),
    }));

    app.use((request, response) => response.status(404).json({ error: 'Rota não encontrada.' }));
    app.use((error, request, response, next) => {
        if (error.type === 'entity.parse.failed') return response.status(400).json({ error: 'JSON inválido.' });
        if (error.status && error.status < 600) return response.status(error.status).json({ error: error.message });
        console.error(error);
        return response.status(500).json({ error: 'Erro interno.' });
    });
    return app;
}

module.exports = { createApp };
/* fim de app.js */
