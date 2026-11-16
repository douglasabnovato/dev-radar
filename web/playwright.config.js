/* Teste de ponta a ponta no navegador: sobe a API de demonstração (em memória, GitHub simulado) e o web do Vite */
import { defineConfig, devices } from "@playwright/test";

/* Portas próprias para não colidir com o `npm start` de quem estiver programando */
const API_PORT = 3363;
const WEB_PORT = 5203;
/* Juiz de Fora (MG): o navegador "informa" esta posição ao formulário */
const POSICAO = { latitude: -21.7642, longitude: -43.3503 };

export default defineConfig({
  testDir: "e2e",
  testMatch: /.*\.e2e\.js$/,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    trace: "retain-on-failure",
    geolocation: POSICAO,
    permissions: ["geolocation"],
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    { command: "npm run demo --prefix ../backend", url: `http://localhost:${API_PORT}/health`, env: { PORT: String(API_PORT), DEMO_GITHUB: "offline", CORS_ORIGIN: `http://localhost:${WEB_PORT}` }, reuseExistingServer: !process.env.CI, timeout: 60_000 },
    { command: `npm start -- --port ${WEB_PORT} --strictPort`, url: `http://localhost:${WEB_PORT}`, env: { VITE_API_URL: `http://localhost:${API_PORT}` }, reuseExistingServer: !process.env.CI, timeout: 60_000 },
  ],
});
/* Fim de playwright.config.js */
