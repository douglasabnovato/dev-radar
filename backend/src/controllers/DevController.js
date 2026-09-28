/*
 * DevController.js · cadastro, listagem, atualização e remoção de devs; avisa em tempo real quem busca por perto.
 */
const schemas = require('../validation/schemas');
const { AppError, parse } = require('../lib/errors');
const parseStringAsArray = require('../utils/parseStringAsArray');

/* Cria o controller com repositório, GitHub e notificador injetados. */
function createDevController({ repository, github, notifier }) {
    return {
        /* GET /devs */
        async index(request, response) {
            return response.json(await repository.list());
        },

        /* POST /devs — idempotente: se já existe, devolve 200 com o cadastro atual. */
        async store(request, response) {
            const data = parse(schemas.createDev, request.body);
            const existing = await repository.findByUsername(data.github_username);
            if (existing) return response.status(200).json(existing);

            const profile = await github.getUser(data.github_username);
            const techs = parseStringAsArray(data.techs);
            let dev;
            try {
                dev = await repository.create({
                    github_username: profile.login.toLowerCase(),
                    name: profile.name,
                    avatar_url: profile.avatar_url,
                    bio: profile.bio,
                    techs,
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
            } catch (error) {
                if (error.code === 11000) return response.status(200).json(await repository.findByUsername(profile.login));
                throw error;
            }
            notifier.notifyNewDev(dev, { latitude: data.latitude, longitude: data.longitude }, techs);
            return response.status(201).json(dev);
        },

        /* PUT /devs/:github_username */
        async update(request, response) {
            const username = parse(schemas.githubUsername, request.params.github_username);
            const data = parse(schemas.updateDev, request.body);
            const dev = await repository.updateByUsername(username, {
                techs: data.techs ? parseStringAsArray(data.techs) : undefined,
                latitude: data.latitude,
                longitude: data.longitude,
            });
            if (!dev) throw new AppError('Dev não encontrado.', 404);
            return response.json(dev);
        },

        /* DELETE /devs/:github_username */
        async destroy(request, response) {
            const username = parse(schemas.githubUsername, request.params.github_username);
            if (!(await repository.deleteByUsername(username))) throw new AppError('Dev não encontrado.', 404);
            return response.status(204).end();
        },
    };
}

module.exports = { createDevController };
/* fim de DevController.js */
