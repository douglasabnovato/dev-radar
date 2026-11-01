/*
 * App.test.js · estados da tela (carregando, erro com retry, vazio, lista) e cadastro com mensagem da API.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import api from "./services/api";

vi.mock("./services/api", async () => {
  const actual = await vi.importActual("./services/api");
  return { __esModule: true, ...actual, default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() } };
});

const DEV = { _id: "1", name: "Ana", github_username: "ana", avatar_url: "a.png", bio: "", techs: ["react"] };

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.navigator.geolocation = { getCurrentPosition: (ok) => ok({ coords: { latitude: -21.76, longitude: -43.35 } }) };
  });

  test("mostra erro com Tentar novamente e depois a lista", async () => {
    api.get.mockRejectedValueOnce(new Error("Network Error")).mockResolvedValueOnce({ data: [DEV] });
    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível falar com o servidor");
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByRole("heading", { name: "Ana" })).toBeInTheDocument();
  });

  test("mostra estado vazio", async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    render(<App />);
    expect(await screen.findByText(/Nenhum dev cadastrado/)).toBeInTheDocument();
  });

  test("cadastra e exibe a mensagem de erro da API quando o usuário não existe", async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    api.post.mockRejectedValueOnce({ response: { data: { error: "Usuário do GitHub não encontrado." } } }).mockResolvedValueOnce({ status: 201, data: DEV });
    render(<App />);
    await screen.findByText(/Nenhum dev cadastrado/);
    fireEvent.change(screen.getByLabelText("Usuário do GitHub"), { target: { value: "x" } });
    fireEvent.change(screen.getByLabelText("Tecnologias"), { target: { value: "react" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    expect(await screen.findByText("Usuário do GitHub não encontrado.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    expect(await screen.findByText("Dev cadastrado!")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ana" })).toBeInTheDocument();
    expect(api.post).toHaveBeenLastCalledWith("/devs", { github_username: "x", techs: "react", latitude: -21.76, longitude: -43.35 });
  });
});
/* fim de App.test.js */
