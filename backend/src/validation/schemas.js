/*
 * schemas.js · validação de entrada com zod: usuário do GitHub, tecnologias e coordenadas válidas.
 */
const { z } = require('zod');

const latitude = z.coerce.number().min(-90, 'latitude entre -90 e 90').max(90, 'latitude entre -90 e 90');
const longitude = z.coerce.number().min(-180, 'longitude entre -180 e 180').max(180, 'longitude entre -180 e 180');
const techs = z.string().trim().min(1, 'informe ao menos uma tecnologia').max(200);
const githubUsername = z
    .string()
    .trim()
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, 'usuário do GitHub inválido');

module.exports = {
    createDev: z.object({ github_username: githubUsername, techs, latitude, longitude }),
    updateDev: z.object({ techs: techs.optional(), latitude: latitude.optional(), longitude: longitude.optional() })
        .refine((data) => (data.latitude === undefined) === (data.longitude === undefined), 'envie latitude e longitude juntas'),
    search: z.object({ techs, latitude, longitude }),
    githubUsername,
};
/* fim de schemas.js */
