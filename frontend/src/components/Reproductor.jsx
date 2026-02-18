import React from "react";
import { Link } from "react-router-dom";

function Reproductor({url, name, number, serie_id}) {
    return (
        <> 
            <Link to={`/serie/${serie_id}`}>
                <h1>{name} {number}</h1>
            </Link>
            <iframe src={url} allowFullScreen frameBorder="0" width="500px" height="500px"></iframe>
        </>
    )
}

export default Reproductor;