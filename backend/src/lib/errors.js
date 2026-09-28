/*
 * errors.js · erro de domínio com status HTTP e conversão de erros do zod.
 */
class AppError extends Error {
    /* Cria o erro com mensagem para o cliente e status HTTP. */
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

/* Valida com o schema ou lança 400 com a primeira mensagem. */
function parse(schema, data) {
    const result = schema.safeParse(data ?? {});
    if (!result.success) {
        const issue = result.error.issues[0];
        const field = issue.path.join('.');
        throw new AppError(field ? `${field}: ${issue.message}` : issue.message, 400);
    }
    return result.data;
}

module.exports = { AppError, parse };
/* fim de errors.js */
