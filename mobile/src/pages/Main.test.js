/* Testes da tela do mapa (#85 e #100): localização negada, busca sem tecnologia, busca vazia, erro do servidor e erro de rede;
   o socket, o aviso anunciado ao leitor de tela e os devs que chegam em tempo real.
   O mapa, a localização, a API e o socket são simulados: nada sai da máquina e nenhum aparelho é preciso (o aparelho é a #69) */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react-native";
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import api from "../services/api";
import { connect, disconnect, subscribeToNewDevs } from "../services/socket";
import Main from "./Main";

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  const MapView = ({ children }) => <View testID="mapa">{children}</View>;
  const Marker = ({ children }) => <View>{children}</View>;
  return { __esModule: true, default: MapView, Marker, Callout: Marker };
});
jest.mock("expo-location", () => ({ requestForegroundPermissionsAsync: jest.fn(), getCurrentPositionAsync: jest.fn() }));
/* O ícone do botão vira um marcador: some enquanto carrega (o botão mostra o ActivityIndicator) e volta no fim */
jest.mock("@expo/vector-icons", () => {
  const { View } = require("react-native");
  return { MaterialIcons: () => <View testID="icone-buscar" /> };
});
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
  const aviso = await screen.findByText("Nenhum dev com essas tecnologias num raio de 10 km.");
  expect(aviso).toBeOnTheScreen();
  /* O TalkBack anuncia o aviso sem a pessoa procurar por ele (#100) */
  expect(aviso).toHaveProp("accessibilityLiveRegion", "polite");
  expect(api.get).toHaveBeenCalledWith("/search", { params: { latitude: -23.55, longitude: -46.63, techs: "Cobol" } });
  expect(connect).toHaveBeenCalledWith(-23.55, -46.63, "Cobol");
});

test("busca com resultado: mostra o dev e nenhum aviso", async () => {
  const dev = { _id: "1", name: "Ada", bio: "Pioneira", techs: ["React"], github_username: "ada", avatar_url: "https://avatars.githubusercontent.com/u/1", location: { coordinates: [-46.63, -23.55] } };
  api.get.mockResolvedValue({ data: { devs: [dev] } });
  await buscar("React");
  expect(await screen.findByText("Ada")).toBeOnTheScreen();
  expect(screen.queryByText(/Nenhum dev|Não foi possível/)).toBeNull();
  /* O socket reconecta com a posição e as tecnologias, e desconecta antes, para não somar conexões (#100) */
  expect(connect).toHaveBeenCalledWith(-23.55, -46.63, "React");
  expect(disconnect).toHaveBeenCalled();
  expect(disconnect.mock.invocationCallOrder[0]).toBeLessThan(connect.mock.invocationCallOrder[0]);
});

test("erro de rede: avisa que não falou com o servidor", async () => {
  api.get.mockRejectedValue(new Error("Network Error"));
  await buscar("React");
  expect(await screen.findByText("Não foi possível falar com o servidor.")).toBeOnTheScreen();
  expect(connect).not.toHaveBeenCalled();
});

/* Carregamento (R19 do QA no #99): com a API pendente o botão carrega; no fim, com resultado ou com erro, volta ao ícone */
test.each([
  ["com resultado", (fim) => fim.resolver({ data: { devs: [] } })],
  ["com erro", (fim) => fim.rejeitar(new Error("Network Error"))],
])("carregamento para no fim da busca %s", async (_, terminar) => {
  const fim = {};
  api.get.mockReturnValue(new Promise((resolver, rejeitar) => Object.assign(fim, { resolver, rejeitar })));
  await render(<Main navigation={navigation} />);
  await screen.findByTestId("mapa");
  await fireEvent.changeText(screen.getByLabelText("Tecnologias para buscar, separadas por vírgula"), "React");
  /* Sem await: no RNTL 14 o press espera o loadDevs, que só termina quando a API responder */
  const busca = fireEvent.press(screen.getByRole("button", { name: "Buscar devs próximos" }));
  expect(await screen.findByTestId("mapa")).toBeOnTheScreen();
  /* Carregando: o ícone dá lugar ao indicador */
  expect(screen.queryByTestId("icone-buscar")).toBeNull();
  terminar(fim);
  await busca;
  expect(await screen.findByTestId("icone-buscar")).toBeOnTheScreen();
});

/* Nova busca limpa o aviso da busca anterior (R19 do QA no #99) */
test("nova busca: o aviso de erro da busca anterior some", async () => {
  api.get.mockRejectedValueOnce(new Error("Network Error"));
  await buscar("React");
  expect(await screen.findByText("Não foi possível falar com o servidor.")).toBeOnTheScreen();
  const dev = { _id: "2", name: "Grace", bio: "Compiladores", techs: ["React"], github_username: "grace", avatar_url: "https://avatars.githubusercontent.com/u/2", location: { coordinates: [-46.63, -23.55] } };
  api.get.mockResolvedValueOnce({ data: { devs: [dev] } });
  await fireEvent.press(screen.getByRole("button", { name: "Buscar devs próximos" }));
  expect(await screen.findByText("Grace")).toBeOnTheScreen();
  expect(screen.queryByText("Não foi possível falar com o servidor.")).toBeNull();
});

test("erro da API: mostra a mensagem que o servidor mandou", async () => {
  api.get.mockRejectedValue({ response: { data: { error: "Latitude inválida." } } });
  await buscar("React");
  expect(await screen.findByText("Latitude inválida.")).toBeOnTheScreen();
});
/* Devs novos em tempo real (#100): o dev que chega pelo socket aparece no mapa, e o mesmo _id não duplica */
test("dev novo pelo socket aparece no mapa, sem duplicar", async () => {
  await render(<Main navigation={navigation} />);
  await screen.findByTestId("mapa");
  expect(subscribeToNewDevs).toHaveBeenCalledTimes(1);
  const chegou = subscribeToNewDevs.mock.calls[0][0];
  const dev = { _id: "3", name: "Linus", bio: "Kernel", techs: ["C"], github_username: "linus", avatar_url: "https://avatars.githubusercontent.com/u/3", location: { coordinates: [-46.63, -23.55] } };
  await act(async () => chegou(dev));
  expect(await screen.findByText("Linus")).toBeOnTheScreen();
  await act(async () => chegou({ ...dev, name: "Linus T." }));
  expect(await screen.findByText("Linus T.")).toBeOnTheScreen();
  expect(screen.queryByText("Linus")).toBeNull();
});
/* fim de Main.test.js */
