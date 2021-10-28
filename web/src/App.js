import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./global.css";
import "./App.css";
import "./Sidebar.css";
import "./Main.css";

import DevItem from "./components/DevItem"

function App(){

  const [devs, setDevs] = useState([]);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [github_username, setGithubUsername] = useState(""); 
  const [techs, setTechs] = useState("");
   
  useEffect(() => { 
    navigator.geolocation.getCurrentPosition( 
      (position) => {  
          const { latitude, longitude } = position.coords; 
          setLatitude(latitude);
          setLongitude(longitude);  
      }, 
      (error) => {
          console.log(error);
      }, 
      {
          timeout: 30000,
      } 
    ) 
  }, []);

  useEffect(() => { 
      async function loadDevs(){
        const response = await api.get("/devs")
        setDevs(response.data)
      }
      loadDevs();
  }, []);

  async function handleAddDev(e){  
    e.prevntDefault(); 
    const response = await api.post("/devs", { 
      github_username,
      techs,
      latitude,
      longitude,
    });  
    setGithubUsername("");
    setTechs("");
    setDevs([...devs, response.data])
  }

  return(
    <div id="app">
      <aside>
        <strong>Cadastrar</strong> 
        <form onSubmit={handleAddDev}>

          <div className="input-block">
            <label htmlFor="github_username">Usuário do Github</label>
            <input 
              name="github_username" 
              id="github_username"
              value={github_username}  
              required 
              onChange={e => setGithubUsername(e.target.value)}/>
          </div>
          
          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input 
              name="techs" 
              id="techs" 
              value={techs}  
              required 
              onChange={e => setTechs(e.target.value)} />
          </div>

          <div className="input-group"> 
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input 
                type="number" 
                name="latitude" 
                id="latitude" 
                value={latitude} 
                required 
                onChange={e => setLatitude(e.target.value)}/>
            </div> 
            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input 
                type="number" 
                name="longitude" 
                id="longitude" 
                value={longitude} 
                required 
                onChange={e => setLongitude(e.target.value)}/>
            </div>
          </div>

          <button type="submit">Salvar</button>
          
        </form>
      </aside>

      <main>
        <ul>
          {devs.map(dev => ( <DevItem key={dev._id} dev={dev}/> ))} 
        </ul>
      </main>
    </div>
  );

}

export default App; 