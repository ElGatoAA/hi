import React, { useState, useEffect } from "react";
import axios from "axios";
import Portadas from "./Portadas";
import "../css/Sugerencias.css";

function Sugerencias({ serieId }) {
    const [sugerencias, setSugerencias] = useState([]);

    useEffect(() => {
        if (!serieId) return;
        axios.get(`http://localhost:3000/sugerencias/${serieId}`).then((response) => {
            setSugerencias(response.data);
        });
    }, [serieId]);

    if (!sugerencias || sugerencias.length === 0) return null;

    return (
        <div className="sugerencias-container">
            <h2>Series Relacionadas</h2>
            <div className="sugerencias-grid">
                {sugerencias.map((serie) => (
                    <Portadas
                        key={serie.id}
                        img={`/src/assets/${serie.img}`}
                        name={serie.name}
                        id={`/serie/${serie.id}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Sugerencias;