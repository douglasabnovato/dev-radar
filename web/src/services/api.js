/*
 * api.js · cliente HTTP da API do DevRadar; a URL vem de VITE_API_URL.
 */
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
  timeout: 10000,
});

/* Extrai a mensagem de erro da API ou devolve uma mensagem genérica de rede. */
export function errorMessage(error) {
  return error?.response?.data?.error || "Não foi possível falar com o servidor. Verifique se a API está no ar.";
}

export default api;
/* fim de api.js */
