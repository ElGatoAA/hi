import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Comentario from "./Comentario";

function Comentarios({ serieId }) {
    const [comentarios, setComentarios] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [respondiendo, setRespondiendo] = useState(null);
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        cargarComentarios();
        
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            setUsuarioActual(user.usuario);
            setIsLoggedIn(true);
        }
    }, [serieId]);

    const cargarComentarios = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/comentarios/${serieId}`);
            setComentarios(response.data);
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            alert("Debes iniciar sesión para comentar");
            return;
        }

        if (!mensaje.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3000/comentarios",
                {
                    serie_id: serieId,
                    mensaje: mensaje,
                    comentario_padre_id: respondiendo?.id || null
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setComentarios([...comentarios, response.data]);
            setMensaje("");
            setRespondiendo(null);
        } catch (error) {
            console.error("Error al crear comentario:", error);
            alert(error.response?.data?.error || "Error al crear comentario");
        }
    };

    const handleResponder = (comentario) => {
        if (!isLoggedIn) {
            alert("Debes iniciar sesión para responder");
            return;
        }
        setRespondiendo(comentario);
        const textoInicial = `@${comentario.usuario} `;
        setMensaje(textoInicial);
        
        // Esperar a que el textarea se renderice y luego posicionar el cursor
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(textoInicial.length, textoInicial.length);
            }
        }, 0);
    };

    const cancelarRespuesta = () => {
        setRespondiendo(null);
        setMensaje("");
    };

    const handleEliminar = async (comentarioId) => {
        if (!confirm("¿Estás seguro de eliminar este comentario?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `http://localhost:3000/comentarios/${comentarioId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setComentarios(comentarios.filter(c => c.id !== comentarioId));
        } catch (error) {
            console.error("Error al eliminar comentario:", error);
            alert(error.response?.data?.error || "Error al eliminar comentario");
        }
    };

    // Función recursiva para obtener todas las respuestas de un comentario
    const getRespuestasRecursivas = (comentarioId) => {
        return comentarios.filter(c => c.comentario_padre_id === comentarioId);
    };

    // Renderizar comentario con sus respuestas recursivamente
    const renderComentario = (comentario, nivel = 0) => {
        const respuestas = getRespuestasRecursivas(comentario.id);
        const esRespondiendo = respondiendo?.id === comentario.id;

        return (
            <div key={comentario.id} style={{ marginLeft: nivel > 0 ? "40px" : "0" }}>
                <Comentario 
                    comentario={comentario}
                    onResponder={handleResponder}
                    onEliminar={handleEliminar}
                    usuarioActual={usuarioActual}
                />
                
                {esRespondiendo && isLoggedIn && (
                    <div style={{ marginLeft: "40px", marginBottom: "15px" }}>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <span>Respondiendo a @{respondiendo.usuario}</span>
                                <button type="button" onClick={cancelarRespuesta}>Cancelar</button>
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                placeholder="Escribe tu respuesta..."
                                rows="3"
                            />
                            <button type="submit">Responder</button>
                        </form>
                    </div>
                )}

                {respuestas.map(respuesta => renderComentario(respuesta, nivel + 1))}
            </div>
        );
    };

    // Obtener solo comentarios padre (sin padre)
    const comentariosPadres = comentarios.filter(c => !c.comentario_padre_id);

    return (
        <div>
            <h2>Comentarios ({comentarios.length})</h2>
            
            {isLoggedIn && !respondiendo ? (
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Escribe un comentario..."
                        rows="3"
                    />
                    <button type="submit">Comentar</button>
                </form>
            ) : !isLoggedIn && (
                <p>Debes iniciar sesión para comentar</p>
            )}

            <div>
                {comentariosPadres.map(comentario => renderComentario(comentario))}
            </div>
        </div>
    );
}

export default Comentarios;