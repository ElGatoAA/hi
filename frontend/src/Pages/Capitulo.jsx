import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Reproductor from "../components/Reproductor";
import Capitulos_serie from "../components/Capitulos_serie";
import Sugerencias from "../components/Sugerencias";
import Comentarios from "../components/Comentarios";
import Nav from "../components/Nav";

function Capitulo() {
    const [capitulo, setCapitulo] = useState(null);
    const [capituloserie, setCapituloserie] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Resetear estados
        setCapitulo(null);
        setCapituloserie([]);

        axios.get(`http://localhost:3000/capitulo/${id}`).then((response) => {
            setCapitulo(response.data);
        });
    }, [id]);

    useEffect(() => {
        if (!capitulo) return;
            axios.get(`http://localhost:3000/capitulosSerie/${capitulo.serie_id}`).then((response) => {
                setCapituloserie(response.data);
            });
    }, [capitulo]);

    if (!capitulo) return <p>Cargando...</p>;

    return (
        <>
            <Nav />
            <Reproductor 
                key={id}
                url={capitulo.url} 
                name={capitulo.name} 
                number={capitulo.number} 
                serie_id={capitulo.serie_id}
            />
            {capituloserie.map((item) => (
                <Capitulos_serie key={item.id} name={item.name} number={item.number} img={`/src/assets/${item.img}`} id={item.id}/>
            ))}
            <Comentarios serieId={capitulo.serie_id} />
            <Sugerencias serieId={capitulo.serie_id} />
        </>
    )
}

export default Capitulo;