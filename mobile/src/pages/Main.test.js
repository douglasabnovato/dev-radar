/* Testes da tela do mapa (#85): localização negada, busca sem tecnologia, busca vazia, erro do servidor e erro de rede.
   O mapa, a localização, a API e o socket são simulados: nada sai da máquina e nenhum aparelho é preciso (o aparelho é a #69) */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import api from "../services/api";
import { connect } from "../services/socket";
import Main from "./Main";

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  const MapView = ({ children }) => <View testID="mapa">{children}</View>;
  const Marker = ({ children }) => <View>{children}</View>;
  return { __esModule: true, default: MapView, Marker, Callout: Marker };
});
jest.mock("expo-location", () => ({ requestForegroundPermissionsAsync: jest.fn(), getCurrentPositionAsync: jest.fn() }));
jest.mock("@expo/vector-icons", () => ({ MaterialIcons: () => null }));
jest.mock("../services/api", () => ({ __esModule: true, default: { get: jest.fn() } }));
jest.mock("../services/socket", () => ({ connect: jest.fn(), disconnect: jest.fn(), subscribeToNewDevs: jest.fn() }));

const navigation = { navigate: jest.fn() };

beforeEach(() => {
  jest.clearAllMocks();
  requestForegroundPermissionsAsync.mockResolvedValue({ granted: true });
  getCurrentPositionAsync.mockResolvedValue({ coords: { latitude: -23.55, longitude: -46.63 } });
});

/* Abre a tela com a localização liberada e busca as tecnologias digitadas */
async function buscar(techs) {
  await render(<Main navigation={navigation} />);
  await screen.findByTestId("mapa");
  await fireEvent.changeText(screen.getByLabelText("Tecnologias para buscar, separadas por vírgula"), techs);
  await fireEvent.press(screen.getByRole("button", { name: "Buscar devs próximos" }));
}

test("localização negada: pede a permissão e não abre o mapa", async () => {
  requestForegroundPermissionsAsync.mockResolvedValue({ granted: false });
  await render(<Main navigation={navigation} />);
  expect(await screen.findByText("Permita o acesso à localização para ver devs perto de você.")).toBeOnTheScreen();
  expect(screen.queryByTestId("mapa")).toBeNull();
  expect(getCurrentPositionAsync).not.toHaveBeenCalled();
});

test("busca sem tecnologia: pede uma e não chama a API", async () => {
  await buscar("   ");
  expect(await screen.findByText("Digite ao menos uma tecnologia, por exemplo: React.")).toBeOnTheScreen();
  expect(api.get).not.toHaveBeenCalled();
});

test("busca vazia: avisa que não há devs no raio de 10 km", async () => {
  api.get.mockResolvedValue({ data: { devs: [] } });
  await buscar("Cobol");
  expect(await screen.findByText("Nenhum dev com essas tecnologias num raio de 10 km.")).toBeOnTheScreen();
  expect(api.get).toHaveBeenCalledWith("/search", { params: { latitude: -23.55, longitude: -46.63, techs: "Cobol" } });
  expect(connect).toHaveBeenCalledWith(-23.55, -46.63, "Cobol");
});

test("busca com resultado: mostra o dev e nenhum aviso", async () => {
  const dev = { _id: "1", name: "Ada", bio: "Pioneira", techs: ["React"], github_username: "ada", avatar_url: "https://avatars.githubusercontent.com/u/1", location: { coordinates: [-46.63, -23.55] } };
  api.get.mockResolvedValue({ data: { devs: [dev] } });
  await buscar("React");
  expect(await screen.findByText("Ada")).toBeOnTheScreen();
  expect(screen.queryByText(/Nenhum dev|Não foi possível/)).toBeNull();
});

test("erro de rede: avisa que não falou com o servidor", async () => {
  api.get.mockRejectedValue(new Error("Network Error"));
  await buscar("React");
  expect(await screen.findByText("Não foi possível falar com o servidor.")).toBeOnTheScreen();
  expect(connect).not.toHaveBeenCalled();
});

test("erro da API: mostra a mensagem que o servidor mandou", async () => {
  api.get.mockRejectedValue({ response: { data: { error: "Latitude inválida." } } });
  await buscar("React");
  expect(await screen.findByText("Latitude inválida.")).toBeOnTheScreen();
});
/* fim de Main.test.js */
