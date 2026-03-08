import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";

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
                `${API_URL}/favoritos/check/${serieId}`,
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
                    `${API_URL}/favoritos/${serieId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setIsFavorito(false);
            } else {
                await axios.post(
                    `${API_URL}/favoritos`,
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