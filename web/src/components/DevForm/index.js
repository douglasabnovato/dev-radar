/*
 * DevForm · cadastro de dev: preenche latitude/longitude pelo navegador e mostra erros e sucesso da API.
 */
import React, { useState, useEffect } from "react";
import { errorMessage } from "../../services/api";
import "./style.css";

/* Formulário controlado; onSubmit devolve a mensagem de sucesso. */
function DevForm({ onSubmit }) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [techs, setTechs] = useState("");
  const [geoMessage, setGeoMessage] = useState("Buscando sua localização…");
  const [feedback, setFeedback] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoMessage("Seu navegador não informa localização. Preencha latitude e longitude.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
        setGeoMessage("");
      },
      () => setGeoMessage("Não foi possível obter sua localização. Preencha latitude e longitude."),
      { timeout: 30000 }
    );
  }, []);

  /* Envia o cadastro e limpa os campos em caso de sucesso. */
  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      const message = await onSubmit({ github_username: githubUsername.trim(), techs, latitude: Number(latitude), longitude: Number(longitude) });
      setFeedback({ type: "success", text: message });
      setGithubUsername("");
      setTechs("");
    } catch (error) {
      setFeedback({ type: "error", text: errorMessage(error) });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-block">
        <label htmlFor="github_username">Usuário do GitHub</label>
        <input name="github_username" id="github_username" required autoComplete="off" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} />
      </div>

      <div className="input-block">
        <label htmlFor="techs">Tecnologias</label>
        <input name="techs" id="techs" required placeholder="Ex.: React, Node.js" aria-describedby="techs-hint" value={techs} onChange={(e) => setTechs(e.target.value)} />
        <small id="techs-hint">Separe por vírgula.</small>
      </div>

      <div className="input-group">
        <div className="input-block">
          <label htmlFor="latitude">Latitude</label>
          <input type="number" step="any" min="-90" max="90" name="latitude" id="latitude" required value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </div>
        <div className="input-block">
          <label htmlFor="longitude">Longitude</label>
          <input type="number" step="any" min="-180" max="180" name="longitude" id="longitude" required value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
      </div>
      {geoMessage && <p className="form-hint" role="status">{geoMessage}</p>}

      {feedback && (
        <p className={`form-feedback ${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
          {feedback.text}
        </p>
      )}

      <button type="submit" disabled={sending}>{sending ? "Salvando…" : "Salvar"}</button>
    </form>
  );
}

export default DevForm;
/* fim de DevForm */
