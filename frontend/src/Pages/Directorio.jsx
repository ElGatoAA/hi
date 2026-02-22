import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import Pages from "../components/Pages";
import Generos from "../components/Generos";
import OrdenarPor from "../components/Ordenarpor";
import "../css/Directorio.css";

function Directorio() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchTerm = searchParams.get("search") || "";
    const generoId = searchParams.get("genero") || "";
    const ordenarPor = searchParams.get("ordenar") || "alfabetico";
    const [generoNombre, setGeneroNombre] = useState("");
    const [generosList, setGenerosList] = useState([]);
    const [openMenu, setOpenMenu] = useState(null); // "generos" | "ordenar" | null

    useEffect(() => {
        axios.get("http://localhost:3000/generos").then((response) => {
            setGenerosList(response.data);
        });
    }, []);

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
            <div className="directorio-header">
                <h1>Directorio</h1>
                <div className="directorio-filtros">
                    <Generos
                        generos={generosList}
                        isOpen={openMenu === "generos"}
                        onToggle={(val) => setOpenMenu(val ? "generos" : null)}
                    />
                    <OrdenarPor
                        ordenActual={ordenarPor}
                        onCambiarOrden={handleCambiarOrden}
                        isOpen={openMenu === "ordenar"}
                        onToggle={(val) => setOpenMenu(val ? "ordenar" : null)}
                    />
                    {searchTerm && <span>Búsqueda: "{searchTerm}"</span>}
                    {generoId && generoNombre && <span>Género: {generoNombre}</span>}
                </div>
            </div>
            <Pages searchTerm={searchTerm} generoId={generoId} ordenarPor={ordenarPor} />
        </div>
    );
}

export default Directorio;