/*
 * api.js · cliente HTTP da API do DevRadar.
 */
import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({ baseURL: API_URL, timeout: 10000 });

export default api;
/* fim de api.js */
