import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Filtros.css";

function Generos({ generos, isOpen, onToggle }) {
    const navigate = useNavigate();

    const handleGeneroClick = (generoId) => {
        navigate(`/directorio?genero=${generoId}`);
        onToggle(false);
    };

    return (
        <div className="generos-wrapper">
            <button className={`generos-btn ${isOpen ? "generos-btn-activo" : ""}`} onClick={() => onToggle(!isOpen)}>
                Géneros
            </button>
            {isOpen && (
                <div className="generos-dropdown">
                    {generos.map((genero) => (
                        <p key={genero.id} onClick={() => handleGeneroClick(genero.id)}>
                            {genero.nombre}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Generos;