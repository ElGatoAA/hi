import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Descripcion from "../components/Descripcion";
import Capitulos_serie from "../components/Capitulos_serie";
import Sugerencias from "../components/Sugerencias";
import Comentarios from "../components/Comentarios";
import Nav from "../components/Nav";
import "../css/Serie.css";

function Serie() {
    const { id } = useParams();
    const [serie, setSerie] = useState(null);
    const [capituloserie, setCapituloserie] = useState([]);
    const [generos, setGeneros] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
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
            <div className="serie-layout">
                <div className="serie-principal">
                    <Descripcion
                        name={serie.name}
                        description={serie.description}
                        year={serie.year}
                        img={`/src/assets/${serie.img}`}
                        generos={generos}
                        serieId={id}
                    />
                    <div className="capitulos-container">
                        <h1>Capítulos</h1>
                        {capituloserie.map((item) => (
                            <Capitulos_serie key={item.id} name={item.name} number={item.number} img={`/src/assets/${item.img}`} id={item.id} />
                        ))}
                    </div>
                    <Comentarios serieId={id} />
                </div>
                <div className="serie-lateral">
                    <Sugerencias serieId={id} />
                </div>
            </div>
        </div>
    );
}

export default Serie;