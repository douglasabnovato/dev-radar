/* Testes da leitura da URL da API a partir de app.json e do link do perfil */
jest.mock("expo-constants", () => ({ __esModule: true, default: { expoConfig: { extra: { apiUrl: "http://192.168.0.10:3333" } } } }));

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

test("monta o link do perfil só com nome válido do GitHub", () => {
  const { githubProfileUrl } = require("./config");
  expect(githubProfileUrl("douglasabnovato")).toBe("https://github.com/douglasabnovato");
  expect(githubProfileUrl("../settings")).toBe("https://github.com/");
  expect(githubProfileUrl(undefined)).toBe("https://github.com/");
});
/* fim de config.test.js */
