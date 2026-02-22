import React from "react";
import { Link } from "react-router-dom";
import BotonFavorito from "./BotonFavorito";
import Rating from "./Rating";
import "../css/Serie.css";

function Descripcion({ name, description, serieId, year, img, generos = [] }) {
    return (
        <div className="serie-container">
            <h1 className="serie-nombre">{name}</h1>
            <div className="serie-contenido">
                <div className="serie-izquierda">
                    <img src={img} alt={name} />
                    <div className="serie-acciones">
                        <BotonFavorito serieId={serieId} />
                        <Rating serieId={serieId} />
                    </div>
                </div>
                <div className="serie-derecha">
                    <p>{description}</p>
                    <p>Año: {year}</p>
                    {generos.length > 0 && (
                        <div className="serie-generos">
                            {generos.map((genero) => (
                                <Link key={genero.id} to={`/directorio?genero=${genero.id}`} className="serie-genero-btn">
                                    {genero.nombre}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Descripcion;