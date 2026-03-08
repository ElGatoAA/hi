import React, { useState, useEffect } from "react";
import axios from "axios";
import Portadas from "./Portadas";
import "../css/Sugerencias.css";
import API_URL from "../config";

function Sugerencias({ serieId }) {
    const [sugerencias, setSugerencias] = useState([]);

    useEffect(() => {
        if (!serieId) return;
        axios.get(`${API_URL}/sugerencias/${serieId}`).then((response) => {
            setSugerencias(response.data);
        });
    }, [serieId]);

    if (!sugerencias || sugerencias.length === 0) return null;

    return (
        <div className="sugerencias-container">
            <h2>Sugerencias</h2>
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