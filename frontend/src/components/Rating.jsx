import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Serie.css";

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
        if (token) cargarRatingUsuario(token);
    }, [serieId]);

    const cargarRatingPromedio = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/rating/${serieId}`);
            setRatingPromedio(response.data.promedio);
            setTotalRatings(response.data.total_ratings);
        } catch (error) {
            console.error(error);
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
            console.error(error);
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
            cargarRatingPromedio();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <p className="rating-promedio">
                ★ {ratingPromedio ?? "—"} <span>({totalRatings})</span>
            </p>
            {isLoggedIn && (
                <div className="rating-estrellas">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(null)}
                            className={star <= (hover || ratingUsuario) ? "estrella activa" : "estrella"}
                        >
                            ★
                        </span>
                    ))}
                </div>
            )}
        </>
    );
}

export default Rating;