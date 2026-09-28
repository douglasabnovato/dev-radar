/*
 * websocket.js · tempo real com Socket.IO: cada cliente informa posição e tecnologias ao conectar;
 * quando um dev é cadastrado, só quem está a até 10 km e busca alguma tecnologia dele recebe "new-dev".
 */
const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

const RADIUS_KM = 10;

/* Guarda as conexões ativas num Map (inserção e remoção O(1)). */
function createConnectionRegistry() {
    const connections = new Map();
    return {
        /* Registra ou atualiza a conexão. */
        add(id, coordinates, techs) {
            connections.set(id, { id, coordinates, techs });
        },

        /* Remove a conexão encerrada. */
        remove(id) {
            connections.delete(id);
        },

        /* Conexões próximas que buscam alguma das tecnologias. O(n) no número de conexões. */
        findNearby(coordinates, techs) {
            return [...connections.values()].filter(
                (connection) =>
                    calculateDistance(coordinates, connection.coordinates) < RADIUS_KM &&
                    connection.techs.some((tech) => techs.includes(tech)),
            );
        },

        /* Quantidade de conexões (usado nos testes). */
        get size() {
            return connections.size;
        },
    };
}

/* Liga o Socket.IO ao servidor HTTP e devolve o notificador usado pelo DevController. */
function setupWebsocket(server, { corsOrigin = '*' } = {}) {
    const io = socketio(server, { cors: { origin: corsOrigin } });
    const registry = createConnectionRegistry();

    io.on('connection', (socket) => {
        const latitude = Number(socket.handshake.query.latitude);
        const longitude = Number(socket.handshake.query.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            socket.disconnect(true);
            return;
        }
        registry.add(socket.id, { latitude, longitude }, parseStringAsArray(socket.handshake.query.techs));
        socket.on('disconnect', () => registry.remove(socket.id));
    });

    return {
        /* Envia o novo dev para as conexões próximas interessadas. */
        notifyNewDev(dev, coordinates, techs) {
            registry.findNearby(coordinates, techs).forEach((connection) => io.to(connection.id).emit('new-dev', dev));
        },
    };
}

module.exports = { setupWebsocket, createConnectionRegistry };
/* fim de websocket.js */
