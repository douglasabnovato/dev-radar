/*
 * config.js · URL da API lida de app.json (expo.extra.apiUrl) e link do perfil no GitHub.
 * No celular, "localhost" é o próprio aparelho: use o IP da sua máquina na rede (ex.: http://192.168.0.10:3333).
 */
import Constants from "expo-constants";

/* expoConfig é o campo atual; manifest ficou para builds antigos. */
const extra = (Constants.expoConfig && Constants.expoConfig.extra) || (Constants.manifest && Constants.manifest.extra) || {};

export const API_URL = extra.apiUrl || "http://localhost:3333";

/* Endereço do perfil; nome fora do padrão do GitHub (letras, números e hífen) cai na página inicial. */
export function githubProfileUrl(username) {
  const name = String(username || "").trim();
  return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(name) ? `https://github.com/${name}` : "https://github.com/";
}
/* fim de config.js */
