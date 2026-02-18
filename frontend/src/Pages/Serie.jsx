import React, { use } from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Descripcion from "../components/Descripcion";
import Capitulos_serie from "../components/Capitulos_serie";
import Sugerencias from "../components/Sugerencias";
import Comentarios from "../components/Comentarios";
import Rating from "../components/Rating";
import Nav from "../components/Nav";

function Serie() {
    const { id } = useParams();
    const [serie, setSerie] = useState(null);
    const [capituloserie, setCapituloserie] = useState([]);
    const [generos, setGeneros] = useState([]);

    useEffect(() => {
        // Scroll al inicio cuando cambie la serie
        window.scrollTo(0, 0);
        
        // Resetear estados
        setSerie(null);
        setCapituloserie([]);
        setGeneros([]);
        
        axios.get(`http://localhost:3000/serie/${id}`).then((response) => {
            setSerie(response.data);
        });
    }, [id]);

    useEffect(() => {
        if (!serie) return;
            axios.get(`http://localhost:3000/capitulosSerie/${serie.id}`).then((response) => {
                setCapituloserie(response.data);
            });
            axios.get(`http://localhost:3000/generosDeSerie/${serie.id}`).then((response) => {
                setGeneros(response.data);
            });
    }, [serie]);

    if (!serie) return <p>Cargando...</p>;

    return (
        <div>
            <Nav />
            <Descripcion 
                name={serie.name} 
                description={serie.description} 
                year={serie.year} 
                img={`/src/assets/${serie.img}`}
                generos={generos}
                serieId={id}
            />
            <Rating serieId={id} />
            <h1>Capítulos</h1>
            {capituloserie.map((item) => (
                <Capitulos_serie key={item.id} name={item.name} number={item.number} img={`/src/assets/${item.img}`} id={item.id}/>
            ))}
            <Comentarios serieId={id} />
            <Sugerencias serieId={id} />
        </div>
    );
}

export default Serie;