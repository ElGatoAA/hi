import React from "react";
import { Link } from "react-router-dom";

function Capitulos_serie({name, number, img, id}) {
    return (
        <Link to={`/capitulo/${id}`}>
            <div>
                <h2>{name} {number}</h2>
                <img src={img} alt={`Capitulo ${number}`} width="500" height="300" />
            </div>
        </Link>
    );
}

export default Capitulos_serie;