import React from "react";
import { Link } from "react-router-dom";
import "../css/Reproductor.css";

function Reproductor({ url, name, number, serie_id }) {
    return (
        <div className="reproductor-container">
            <Link to={`/serie/${serie_id}`}>
                <h1>{name} {number}</h1>
            </Link>
            <iframe src={url} allowFullScreen frameBorder="0"></iframe>
        </div>
    )
}

export default Reproductor;