/*
 * socket.js · conexão Socket.IO que informa posição e tecnologias para receber novos devs por perto.
 */
import socketio from "socket.io-client";
import { API_URL } from "../config";

const socket = socketio(API_URL, { autoConnect: false });

/* Registra o callback de novos devs, trocando o anterior (evita ouvintes duplicados). */
function subscribeToNewDevs(subscribeFunction) {
  socket.off("new-dev");
  socket.on("new-dev", subscribeFunction);
}

/* Conecta enviando a região e as tecnologias buscadas. */
function connect(latitude, longitude, techs) {
  socket.io.opts.query = { latitude, longitude, techs };
  socket.connect();
}

/* Desconecta se estiver conectado. */
function disconnect() {
  if (socket.connected) socket.disconnect();
}

export { connect, disconnect, subscribeToNewDevs };
/* fim de socket.js */
