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
const { createMemoryRepository } = require('../src/repositories/memoryDevRepository');

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

test('serviço do GitHub avisa quando a cota de consultas acaba', async () => {
    const headers = (h) => ({ get: (k) => h[k] ?? null });
    const reset = String(Math.floor(Date.now() / 1000) + 600);
    const limited = createGithubService(async () => ({ ok: false, status: 403, headers: headers({ 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': reset }) }));
    await assert.rejects(limited.getUser('x'), (err) => err.status === 429 && /em cerca de 10 min/.test(err.message));
    const tooMany = createGithubService(async () => ({ ok: false, status: 429, headers: headers({}) }));
    await assert.rejects(tooMany.getUser('x'), (err) => err.status === 429 && /mais tarde/.test(err.message));
    const forbidden = createGithubService(async () => ({ ok: false, status: 403, headers: headers({ 'x-ratelimit-remaining': '12' }) }));
    await assert.rejects(forbidden.getUser('x'), { status: 503 });
});
/* fim de api.test.js */
