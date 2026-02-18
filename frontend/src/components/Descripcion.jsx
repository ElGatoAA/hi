import React from "react";
import { Link } from "react-router-dom";
import BotonFavorito from "./BotonFavorito";

function Descripcion({name, description, serieId, year, img, generos = []}) {
    return (
        <div>
            <h2>{name}</h2>
            <img src={img} alt={name} width={500} height={500}/>
            <p>Descripcion: {description}</p>
            <p>Año: {year}</p>
            {generos.length > 0 && (
                <p>
                    Géneros: {generos.map((genero, index) => (
                        <span key={genero.id}>
                            <Link to={`/directorio?genero=${genero.id}`}>
                                {genero.nombre}
                            </Link>
                            {index < generos.length - 1 && ", "}
                        </span>
                    ))}
                </p>
            )}
            <BotonFavorito serieId={serieId} />     
        </div>
    );
}

export default Descripcion;