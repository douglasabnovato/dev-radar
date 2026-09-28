/*
 * api.test.js · testes da API com repositório em memória e GitHub simulado (inversão de dependência),
 * além dos utilitários de distância, tecnologias e do registro de conexões em tempo real.
 */
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');
const calculateDistance = require('../src/utils/calculateDistance');
const parseStringAsArray = require('../src/utils/parseStringAsArray');
const { createConnectionRegistry } = require('../src/websocket');
const { createGithubService } = require('../src/services/githubService');

/* Repositório em memória com o mesmo contrato do mongoDevRepository. */
function createMemoryRepository() {
    const devs = new Map();
    return {
        list: async () => [...devs.values()],
        findByUsername: async (username) => devs.get(username.toLowerCase()) || null,
        create: async ({ latitude, longitude, ...data }) => {
            const dev = { _id: String(devs.size + 1), ...data, location: { type: 'Point', coordinates: [longitude, latitude] } };
            devs.set(dev.github_username, dev);
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

const JUIZ_DE_FORA = { latitude: -21.7642, longitude: -43.3503 };
let app;
let notified;
let githubCalls;

beforeEach(() => {
    notified = [];
    githubCalls = 0;
    const github = {
        getUser: async (username) => {
            githubCalls += 1;
            if (username === 'nao-existe') {
                const error = new Error('Usuário do GitHub não encontrado.');
                error.status = 404;
                throw error;
            }
            return { login: username, name: `Nome ${username}`, avatar_url: 'https://avatars.example/1', bio: '' };
        },
    };
    app = createApp({ repository: createMemoryRepository(), github, notifier: { notifyNewDev: (...args) => notified.push(args) } });
});

test('Haversine: Juiz de Fora → Rio de Janeiro ≈ 130 km e distância zero no mesmo ponto', () => {
    const rio = { latitude: -22.9068, longitude: -43.1729 };
    const km = calculateDistance(JUIZ_DE_FORA, rio);
    assert.ok(km > 125 && km < 135, `obtido ${km}`);
    assert.equal(calculateDistance(JUIZ_DE_FORA, JUIZ_DE_FORA), 0);
});

test('tecnologias normalizadas: minúsculas, sem vazios e sem duplicatas', () => {
    assert.deepEqual(parseStringAsArray(' ReactJS, node.js,, reactjs ,'), ['reactjs', 'node.js']);
    assert.deepEqual(parseStringAsArray(undefined), []);
});

test('cadastra dev, notifica em tempo real e não duplica o cadastro', async () => {
    const body = { github_username: 'douglasabnovato', techs: 'ReactJS, Node.js', ...JUIZ_DE_FORA };
    const created = await request(app).post('/devs').send(body);
    assert.equal(created.status, 201);
    assert.deepEqual(created.body.techs, ['reactjs', 'node.js']);
    assert.deepEqual(created.body.location.coordinates, [JUIZ_DE_FORA.longitude, JUIZ_DE_FORA.latitude]);
    assert.equal(notified.length, 1);

    const again = await request(app).post('/devs').send({ ...body, github_username: 'DouglasABNovato' });
    assert.equal(again.status, 200);
    assert.equal(githubCalls, 1);
});

test('valida entrada e trata usuário inexistente no GitHub', async () => {
    const invalid = await request(app).post('/devs').send({ github_username: 'x y', techs: '', latitude: 200, longitude: 0 });
    assert.equal(invalid.status, 400);
    const missing = await request(app).post('/devs').send({ github_username: 'nao-existe', techs: 'go', ...JUIZ_DE_FORA });
    assert.equal(missing.status, 404);
    assert.match(missing.body.error, /não encontrado/);
});

test('busca por tecnologia dentro de 10 km', async () => {
    await request(app).post('/devs').send({ github_username: 'perto', techs: 'react', ...JUIZ_DE_FORA });
    await request(app).post('/devs').send({ github_username: 'longe', techs: 'react', latitude: -22.9068, longitude: -43.1729 });
    const result = await request(app).get('/search').query({ techs: 'React', latitude: -21.77, longitude: -43.35 });
    assert.equal(result.status, 200);
    assert.deepEqual(result.body.devs.map((dev) => dev.github_username), ['perto']);
    assert.equal((await request(app).get('/search').query({ latitude: 0, longitude: 0 })).status, 400);
});

test('atualiza e remove dev', async () => {
    await request(app).post('/devs').send({ github_username: 'ana', techs: 'vue', ...JUIZ_DE_FORA });
    const updated = await request(app).put('/devs/ana').send({ techs: 'Vue, Nuxt' });
    assert.deepEqual(updated.body.techs, ['vue', 'nuxt']);
    assert.equal((await request(app).put('/devs/ana').send({ latitude: 1 })).status, 400);
    assert.equal((await request(app).delete('/devs/ana')).status, 204);
    assert.equal((await request(app).delete('/devs/ana')).status, 404);
});

test('registro de conexões: filtra por raio e tecnologia e remove ao desconectar', () => {
    const registry = createConnectionRegistry();
    registry.add('a', JUIZ_DE_FORA, ['react']);
    registry.add('b', { latitude: -22.9068, longitude: -43.1729 }, ['react']);
    registry.add('c', JUIZ_DE_FORA, ['go']);
    assert.deepEqual(registry.findNearby(JUIZ_DE_FORA, ['react']).map((c) => c.id), ['a']);
    registry.remove('a');
    assert.equal(registry.size, 2);
});

test('serviço do GitHub usa HTTPS e traduz 404 e falha de rede', async () => {
    let calledUrl;
    const ok = createGithubService(async (url) => {
        calledUrl = url;
        return { ok: true, status: 200, json: async () => ({ login: 'ana', name: null, avatar_url: 'x', bio: null }) };
    });
    assert.deepEqual(await ok.getUser('ana'), { login: 'ana', name: 'ana', avatar_url: 'x', bio: '' });
    assert.match(calledUrl, /^https:\/\/api\.github\.com\/users\/ana$/);
    const notFound = createGithubService(async () => ({ ok: false, status: 404 }));
    await assert.rejects(notFound.getUser('x'), { status: 404 });
    const offline = createGithubService(async () => { throw new TypeError('fetch failed'); });
    await assert.rejects(offline.getUser('x'), { status: 503 });
});
/* fim de api.test.js */
