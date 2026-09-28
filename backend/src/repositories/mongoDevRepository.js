/*
 * mongoDevRepository.js · persistência dos devs no MongoDB (consultas geoespaciais com $near no índice 2dsphere).
 */
const Dev = require('../models/Dev');

/* Converte { latitude, longitude } no ponto GeoJSON [longitude, latitude]. */
function toPoint({ latitude, longitude }) {
    return { type: 'Point', coordinates: [longitude, latitude] };
}

module.exports = {
    /* Lista os devs mais recentes primeiro. */
    list: () => Dev.find().sort({ createdAt: -1 }).limit(200).lean(),

    /* Busca pelo usuário do GitHub. */
    findByUsername: (username) => Dev.findOne({ github_username: username.toLowerCase() }).lean(),

    /* Cria o dev; lança erro de chave duplicada (código 11000) em corrida. */
    create: async (data) => (await Dev.create({ ...data, location: toPoint(data) })).toObject(),

    /* Atualiza tecnologias e/ou localização. */
    updateByUsername: (username, { techs, latitude, longitude }) => {
        const changes = {};
        if (techs) changes.techs = techs;
        if (latitude !== undefined) changes.location = toPoint({ latitude, longitude });
        return Dev.findOneAndUpdate({ github_username: username.toLowerCase() }, changes, { new: true }).lean();
    },

    /* Remove o dev e devolve se existia. */
    deleteByUsername: async (username) => (await Dev.deleteOne({ github_username: username.toLowerCase() })).deletedCount > 0,

    /* Devs com alguma das tecnologias, ordenados por distância até maxDistance metros. */
    searchNear: ({ latitude, longitude, techs, maxDistance }) =>
        Dev.find({
            techs: { $in: techs },
            location: { $near: { $geometry: toPoint({ latitude, longitude }), $maxDistance: maxDistance } },
        }).limit(100).lean(),
};
/* fim de mongoDevRepository.js */
