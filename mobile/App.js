/*
 * App.js · raiz do app móvel: barra de status e navegação.
 */
import React from "react";
import { StatusBar, LogBox } from "react-native";
import Routes from "./src/routes";

LogBox.ignoreLogs(["Unrecognized WebSocket"]);

/* Componente raiz. */
export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7D40E7" />
      <Routes />
    </>
  );
}
/* fim de App.js */
