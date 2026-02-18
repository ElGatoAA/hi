import React, { useState, useEffect } from "react";
import axios from "axios";
import Portadas from "./Portadas";

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
        <div>
            <h2>Series Relacionadas</h2>
            <div>
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