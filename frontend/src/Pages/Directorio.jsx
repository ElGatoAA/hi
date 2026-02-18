import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import Pages from "../components/Pages";
import Generos from "../components/Generos";
import OrdenarPor from "../components/Ordenarpor";

function Directorio() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get("search") || "";
    const generoId = searchParams.get("genero") || "";
    const ordenarPor = searchParams.get("ordenar") || "alfabetico";
    const [generoNombre, setGeneroNombre] = useState("");

    useEffect(() => {
        if (generoId) {
            axios.get(`http://localhost:3000/genero/${generoId}`).then((response) => {
                setGeneroNombre(response.data.nombre);
            });
        } else {
            setGeneroNombre("");
        }
    }, [generoId]);

    const handleCambiarOrden = (nuevoOrden) => {
        const params = new URLSearchParams(searchParams);
        params.set("ordenar", nuevoOrden);
        setSearchParams(params);
    };

    return (
        <div>
            <Nav />
            <h1>Directorio</h1>
            <Generos />
            <OrdenarPor ordenActual={ordenarPor} onCambiarOrden={handleCambiarOrden} />
            {searchTerm && <p>Resultados para: "{searchTerm}"</p>}
            {generoId && generoNombre && <p>Género: {generoNombre}</p>}
            <Pages searchTerm={searchTerm} generoId={generoId} ordenarPor={ordenarPor} /> 
        </div>
    )
}

export default Directorio;