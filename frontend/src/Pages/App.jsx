import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Portadas from '../components/Portadas';
import Nav from '../components/Nav';
import axios from 'axios';
import API_URL from '../config.js';

function App() {
  const [anime1, setAnime1] = useState([]);
  
  useEffect(() => {
    console.log("API_URL:", API_URL);
    axios.get(`${API_URL}/portadas`).then((response) => {
        setAnime1(response.data);
    });
}, []);

  return (
    <>
      <Nav />
      <div className="directorio-header">
            <h1>Nuevos capitulos</h1>
      </div>
      <div className="portadas-grid">
        {anime1.map((item) => (
          <Portadas key={item.id} img={`/src/assets/${item.img}`} name={item.name} number={item.number} id={`/capitulo/${item.id}`} />
        ))}
      </div>
    </>
  )
}

export default App;