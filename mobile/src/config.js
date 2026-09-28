/*
 * config.js · URL da API lida de app.json (expo.extra.apiUrl).
 * No celular, "localhost" é o próprio aparelho: use o IP da sua máquina na rede (ex.: http://192.168.0.10:3333).
 */
import Constants from "expo-constants";

const extra = (Constants.manifest && Constants.manifest.extra) || (Constants.expoConfig && Constants.expoConfig.extra) || {};

export const API_URL = extra.apiUrl || "http://localhost:3333";
/* fim de config.js */
