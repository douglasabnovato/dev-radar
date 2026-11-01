/* Testes da leitura da URL da API a partir de app.json */
jest.mock("expo-constants", () => ({ __esModule: true, default: { manifest: { extra: { apiUrl: "http://192.168.0.10:3333" } } } }));

test("usa expo.extra.apiUrl quando existe", () => {
  const { API_URL } = require("./config");
  expect(API_URL).toBe("http://192.168.0.10:3333");
});

test("usa localhost quando não há configuração", () => {
  jest.resetModules();
  jest.doMock("expo-constants", () => ({ __esModule: true, default: {} }));
  const { API_URL } = require("./config");
  expect(API_URL).toBe("http://localhost:3333");
});
/* fim de config.test.js */
