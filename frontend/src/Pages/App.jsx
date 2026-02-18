import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Portadas from '../components/Portadas';
import Nav from '../components/Nav';
import axios from 'axios';

function App() {
  const [anime1, setAnime1] = useState([]);
  
  useEffect(() => {
    axios.get("http://localhost:3000/portadas").then((response) => {
      setAnime1(response.data);
    });
  }, []);

  return (
    <>
      <Nav />
      <h1>Portadas</h1>
      {anime1.map((item) => (
        <Portadas key={item.id} img={`/src/assets/${item.img}`} name={item.name} number={item.number} id={`/capitulo/${item.id}`} />
      ))}
    </>
  )
}

export default App;
