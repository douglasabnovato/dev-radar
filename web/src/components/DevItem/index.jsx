/*
 * DevItem · cartão do dev com avatar, tecnologias, bio, link do GitHub e remoção.
 */
import React, { useState } from "react";
import { errorMessage } from "../../services/api";
import "./style.css";

/* Renderiza o cartão; a remoção pede confirmação nativa e mostra erro se falhar. */
function DevItem({ dev, onRemove }) {
  const [error, setError] = useState("");

  /* Remove o dev após confirmação. */
  async function handleRemove() {
    if (!window.confirm(`Remover ${dev.name} do radar?`)) return;
    try {
      await onRemove(dev.github_username);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <li className="dev-item">
      <header>
        <img src={dev.avatar_url} alt="" width="54" height="54" loading="lazy" />
        <div className="user-info">
          <h3>{dev.name}</h3>
          <span>{dev.techs.join(", ")}</span>
        </div>
      </header>
      {dev.bio && <p>{dev.bio}</p>}
      <div className="dev-actions">
        <a href={`https://github.com/${dev.github_username}`} target="_blank" rel="noopener noreferrer">
          Acessar o perfil no GitHub<span className="sr-only"> de {dev.name} (abre em nova aba)</span>
        </a>
        <button type="button" className="remove" onClick={handleRemove}>
          Remover<span className="sr-only"> {dev.name}</span>
        </button>
      </div>
      {error && <p className="item-error" role="alert">{error}</p>}
    </li>
  );
}

export default DevItem;
/* fim de DevItem */
