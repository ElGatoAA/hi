import React from "react";
import { Link } from "react-router-dom";
import "../css/Serie.css";

function Capitulos_serie({ name, number, img, id }) {
    return (
        <Link to={`/capitulo/${id}`} className="capitulo-item">
            <img src={img} alt={`Capitulo ${number}`} />
            <p>{name} {number}</p>
        </Link>
    );
}

export default Capitulos_serie;