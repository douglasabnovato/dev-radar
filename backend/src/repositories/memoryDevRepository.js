/*
 * memoryDevRepository.js · repositório em memória com o mesmo contrato do mongoDevRepository (testes e demonstração local).
 */
const calculateDistance = require('../utils/calculateDistance');

/* Cria um repositório vazio; os dados somem quando o processo para. */
function createMemoryRepository() {
    const devs = new Map();
    let nextId = 1;
    return {
        list: async () => [...devs.values()].reverse(),
        findByUsername: async (username) => devs.get(username.toLowerCase()) || null,
        create: async ({ latitude, longitude, ...data }) => {
            const dev = { _id: String(nextId++), ...data, location: { type: 'Point', coordinates: [longitude, latitude] } };
            devs.set(dev.github_username.toLowerCase(), dev);
            return dev;
        },
        updateByUsername: async (username, { techs, latitude, longitude }) => {
            const dev = devs.get(username.toLowerCase());
            if (!dev) return null;
            if (techs) dev.techs = techs;
            if (latitude !== undefined) dev.location = { type: 'Point', coordinates: [longitude, latitude] };
            return dev;
        },
        deleteByUsername: async (username) => devs.delete(username.toLowerCase()),
        searchNear: async ({ latitude, longitude, techs, maxDistance }) =>
            [...devs.values()].filter((dev) =>
                dev.techs.some((tech) => techs.includes(tech)) &&
                calculateDistance({ latitude, longitude }, { latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }) * 1000 <= maxDistance),
    };
}

module.exports = { createMemoryRepository };
/* fim de memoryDevRepository.js */
