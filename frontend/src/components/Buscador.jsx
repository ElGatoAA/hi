import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Buscador() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== "") {
            navigate(`/directorio?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Buscar serie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Buscar</button>
        </form>
    );
}

export default Buscador;