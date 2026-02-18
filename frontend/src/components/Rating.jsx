import React, { useState, useEffect } from "react";
import axios from "axios";

function Rating({ serieId }) {
    const [ratingUsuario, setRatingUsuario] = useState(null);
    const [ratingPromedio, setRatingPromedio] = useState(null);
    const [totalRatings, setTotalRatings] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hover, setHover] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        cargarRatingPromedio();

        if (token) {
            cargarRatingUsuario(token);
        }
    }, [serieId]);

    const cargarRatingPromedio = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/rating/${serieId}`);
            setRatingPromedio(response.data.promedio);
            setTotalRatings(response.data.total_ratings);
        } catch (error) {
            console.error("Error al cargar rating promedio:", error);
        }
    };

    const cargarRatingUsuario = async (token) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/rating/${serieId}/usuario`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRatingUsuario(response.data.rating);
        } catch (error) {
            console.error("Error al cargar rating del usuario:", error);
        }
    };

    const handleRating = async (rating) => {
        if (!isLoggedIn) {
            alert("Debes iniciar sesión para calificar");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:3000/rating",
                { serie_id: serieId, rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setRatingUsuario(rating);
            cargarRatingPromedio(); // Recargar el promedio
        } catch (error) {
            console.error("Error al guardar rating:", error);
            alert(error.response?.data?.error || "Error al guardar rating");
        }
    };

    return (
        <div>
            <div>
                <h3>Calificación</h3>
                {ratingPromedio ? (
                    <p>
                        ★ {ratingPromedio} / 5 ({totalRatings} {totalRatings === 1 ? 'voto' : 'votos'})
                    </p>
                ) : (
                    <p>Sin calificaciones aún</p>
                )}
            </div>

            {isLoggedIn && (
                <div>
                    <p>Tu calificación:</p>
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => handleRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(null)}
                                style={{
                                    cursor: "pointer",
                                    fontSize: "30px",
                                    color: star <= (hover || ratingUsuario) ? "#ffd700" : "#ccc"
                                }}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    {ratingUsuario && <p>Calificaste con {ratingUsuario} estrellas</p>}
                </div>
            )}
        </div>
    );
}

export default Rating;