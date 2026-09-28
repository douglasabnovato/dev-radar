/*
 * githubService.js · busca o perfil público no GitHub (HTTPS, timeout de 5 s, erros traduzidos).
 */
const { AppError } = require('../lib/errors');

/* Cria o serviço; fetchImpl é injetável para testes. */
function createGithubService(fetchImpl = globalThis.fetch) {
    return {
        /* Devolve { login, name, avatar_url, bio } ou lança 404/503. */
        async getUser(username) {
            let response;
            try {
                response = await fetchImpl(`https://api.github.com/users/${encodeURIComponent(username)}`, {
                    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'devradar' },
                    signal: AbortSignal.timeout(5000),
                });
            } catch (error) {
                throw new AppError('GitHub indisponível no momento. Tente de novo.', 503);
            }
            if (response.status === 404) throw new AppError('Usuário do GitHub não encontrado.', 404);
            if (!response.ok) throw new AppError('GitHub indisponível no momento. Tente de novo.', 503);
            const { login, name, avatar_url: avatarUrl, bio } = await response.json();
            return { login, name: name || login, avatar_url: avatarUrl, bio: bio || '' };
        },
    };
}

module.exports = { createGithubService };
/* fim de githubService.js */
