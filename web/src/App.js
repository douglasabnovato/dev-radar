/*
 * App.js · tela do DevRadar web: cadastro à esquerda e lista de devs à direita,
 * com estados de carregando, erro (tentar de novo), vazio e sucesso.
 */
import React, { useCallback, useEffect, useState } from "react";
import api, { errorMessage } from "./services/api";
import "./global.css";
import "./App.css";
import "./Sidebar.css";
import "./Main.css";
import DevItem from "./components/DevItem";
import DevForm from "./components/DevForm";

/* Componente raiz. */
function App() {
  const [devs, setDevs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  /* Carrega a lista de devs. */
  const loadDevs = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await api.get("/devs");
      setDevs(response.data);
      setStatus("ready");
    } catch (err) {
      setError(errorMessage(err));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadDevs();
  }, [loadDevs]);

  /* Cadastra e coloca o dev no topo; se já existia, substitui em vez de duplicar. */
  async function handleAddDev(data) {
    const response = await api.post("/devs", data);
    setDevs((current) => [response.data, ...current.filter((dev) => dev.github_username !== response.data.github_username)]);
    return response.status === 201 ? "Dev cadastrado!" : "Esse dev já estava cadastrado.";
  }

  /* Remove o dev da API e da lista. */
  async function handleRemoveDev(githubUsername) {
    await api.delete(`/devs/${githubUsername}`);
    setDevs((current) => current.filter((dev) => dev.github_username !== githubUsername));
  }

  return (
    <div id="app">
      <aside aria-labelledby="form-title">
        <h1 id="form-title">Cadastrar</h1>
        <DevForm onSubmit={handleAddDev} />
      </aside>
      <main aria-busy={status === "loading"}>
        <h2 className="sr-only">Devs cadastrados</h2>
        {status === "loading" && <p className="state" role="status">Carregando devs…</p>}
        {status === "error" && (
          <div className="state state-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={loadDevs}>Tentar novamente</button>
          </div>
        )}
        {status === "ready" && devs.length === 0 && (
          <p className="state" role="status">Nenhum dev cadastrado ainda. Use o formulário para cadastrar o primeiro.</p>
        )}
        {status === "ready" && devs.length > 0 && (
          <ul>
            {devs.map((dev) => (
              <DevItem key={dev._id || dev.github_username} dev={dev} onRemove={handleRemoveDev} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default App;
/* fim de App.js */
