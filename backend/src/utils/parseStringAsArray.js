/*
 * parseStringAsArray.js · "ReactJS, Node.js ,  " → ["reactjs", "node.js"] (sem vazios, sem duplicatas, minúsculas).
 */

/* Normaliza a lista de tecnologias para comparação exata na busca. */
module.exports = function parseStringAsArray(arrayAsString = '') {
    const items = String(arrayAsString)
        .split(',')
        .map((tech) => tech.trim().toLowerCase())
        .filter(Boolean);
    return [...new Set(items)];
};
/* fim de parseStringAsArray.js */
