import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Generos() {
    const [generos, setGeneros] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3000/generos`).then((response) => {
            setGeneros(response.data);
        });
    }, []);

    const handleGeneroClick = (generoId) => {
        navigate(`/directorio?genero=${generoId}`);
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button onClick={toggleMenu}>
                {isOpen ? "✕" : "☰"} Géneros
            </button>
            {isOpen && (
                <div>
                    {generos.map((genero) => (
                        <div
                            key={genero.id}
                            onClick={() => handleGeneroClick(genero.id)}
                        >
                            <p>{genero.nombre}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Generos;