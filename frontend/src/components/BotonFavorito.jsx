import React, { useState, useEffect } from "react";
import axios from "axios";

function BotonFavorito({ serieId }) {
    const [isFavorito, setIsFavorito] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        if (token) {
            checkFavorito();
        }
    }, [serieId]);

    const checkFavorito = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:3000/favoritos/check/${serieId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsFavorito(response.data.isFavorito);
        } catch (error) {
            console.error("Error al verificar favorito:", error);
        }
    };

    const toggleFavorito = async () => {
        if (!isLoggedIn) {
            alert("Debes iniciar sesión para agregar favoritos");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (isFavorito) {
                await axios.delete(
                    `http://localhost:3000/favoritos/${serieId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorito(false);
            } else {
                await axios.post(
                    `http://localhost:3000/favoritos`,
                    { serie_id: serieId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorito(true);
            }
        } catch (error) {
            console.error("Error al cambiar favorito:", error);
            alert(error.response?.data?.error || "Error al cambiar favorito");
        }
    };

    if (!isLoggedIn) return null;

    return (
        <button onClick={toggleFavorito}>
            <span style={{ color: isFavorito ? "red" : "gray", fontSize: "24px" }}>
                ♥
            </span>
        </button>
    );
}

export default BotonFavorito;