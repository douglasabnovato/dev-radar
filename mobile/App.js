/*
 * App.js · raiz do app móvel: barra de status e navegação em pilha (React Navigation 7).
 */
import React from "react";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import Routes from "./src/routes";

LogBox.ignoreLogs(["Unrecognized WebSocket"]);

/* Componente raiz. */
export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Routes />
    </>
  );
}
/* fim de App.js */
