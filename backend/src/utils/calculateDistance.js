/*
 * calculateDistance.js · distância em km entre dois pontos pela fórmula de Haversine (raio médio da Terra 6371 km).
 */
const EARTH_RADIUS_KM = 6371;

/* Converte graus em radianos. */
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/* Recebe { latitude, longitude } de cada ponto e devolve a distância do grande círculo em km. */
module.exports = function calculateDistance(centerCoordinates, pointCoordinates) {
    const { latitude: lat1, longitude: lon1 } = centerCoordinates;
    const { latitude: lat2, longitude: lon2 } = pointCoordinates;

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
/* fim de calculateDistance.js */
