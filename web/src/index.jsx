/*
 * index.js · ponto de entrada (React 18, createRoot).
 */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
/* fim de index.js */
