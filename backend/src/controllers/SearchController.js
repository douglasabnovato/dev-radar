/*
 * SearchController.js · busca devs por tecnologia num raio configurável (padrão 10 km).
 */
const schemas = require('../validation/schemas');
const { parse } = require('../lib/errors');
const parseStringAsArray = require('../utils/parseStringAsArray');

/* Cria o controller com o repositório e o raio injetados. */
function createSearchController({ repository, radiusMeters }) {
    return {
        /* GET /search?latitude&longitude&techs */
        async index(request, response) {
            const { latitude, longitude, techs } = parse(schemas.search, request.query);
            const devs = await repository.searchNear({
                latitude,
                longitude,
                techs: parseStringAsArray(techs),
                maxDistance: radiusMeters,
            });
            return response.json({ devs });
        },
    };
}

module.exports = { createSearchController };
/* fim de SearchController.js */
