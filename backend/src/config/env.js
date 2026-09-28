/*
 * env.js · configuração pelo ambiente (12-Factor III); a URI do MongoDB nunca fica no código.
 */
require('dotenv').config();

module.exports = {
    port: Number(process.env.PORT) || 3333,
    mongoUri: process.env.MONGODB_URI,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    searchRadiusMeters: Number(process.env.SEARCH_RADIUS_METERS) || 10000,
};
/* fim de env.js */
