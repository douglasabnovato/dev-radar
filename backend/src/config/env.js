/*
 * env.js · configuração pelo ambiente (12-Factor III); a URI do MongoDB nunca fica no código.
 */
require('dotenv').config();

module.exports = {
    port: Number(process.env.PORT) || 3333,
    mongoUri: process.env.MONGODB_URI,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    searchRadiusMeters: Number(process.env.SEARCH_RADIUS_METERS) || 10000,
    /* Opcional: token do GitHub (só nos segredos da hospedagem) sobe a cota de 60 para 5.000 consultas por hora */
    githubToken: process.env.GITHUB_TOKEN?.trim() || undefined,
};
/* fim de env.js */
