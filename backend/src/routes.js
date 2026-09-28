/*
 * routes.js · rotas REST do DevRadar.
 */
const { Router } = require('express');

/* Cria o roteador com os controllers injetados; erros assíncronos seguem para o tratador. */
function createRoutes({ devController, searchController }) {
    const routes = Router();
    const wrap = (handler) => (request, response, next) => Promise.resolve(handler(request, response)).catch(next);

    routes.get('/health', (request, response) => response.json({ status: 'ok' }));
    routes.get('/devs', wrap(devController.index));
    routes.post('/devs', wrap(devController.store));
    routes.put('/devs/:github_username', wrap(devController.update));
    routes.delete('/devs/:github_username', wrap(devController.destroy));
    routes.get('/search', wrap(searchController.index));

    return routes;
}

module.exports = { createRoutes };
/* fim de routes.js */
