import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Comentario from "./Comentario";
import "../css/Comentarios.css";

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
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn || !mensaje.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3000/comentarios",
                { serie_id: serieId, mensaje, comentario_padre_id: respondiendo?.id || null },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComentarios([...comentarios, response.data]);
            setMensaje("");
            setRespondiendo(null);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Error al crear comentario");
        }
    };

    const handleResponder = (comentario) => {
        if (!isLoggedIn) return;
        setRespondiendo(comentario);
        const textoInicial = `@${comentario.usuario} `;
        setMensaje(textoInicial);
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
            console.error(error);
        }
    };

    const getRespuestasRecursivas = (comentarioId) =>
        comentarios.filter(c => c.comentario_padre_id === comentarioId);

    const renderComentario = (comentario, nivel = 0) => {
        const respuestas = getRespuestasRecursivas(comentario.id);
        const esRespondiendo = respondiendo?.id === comentario.id;

        return (
            <div key={comentario.id} style={{ marginLeft: nivel > 0 ? "32px" : "0" }}>
                <Comentario
                    comentario={comentario}
                    onResponder={handleResponder}
                    onEliminar={handleEliminar}
                    usuarioActual={usuarioActual}
                />
                {esRespondiendo && (
                    <div className="comentario-respuesta">
                        <form onSubmit={handleSubmit} className="comentario-form">
                            <div className="comentario-respuesta-header">
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
                {respuestas.map(r => renderComentario(r, nivel + 1))}
            </div>
        );
    };

    const comentariosPadres = comentarios.filter(c => !c.comentario_padre_id);

    return (
        <div className="comentarios-container">
            <h2>Comentarios ({comentarios.length})</h2>

            {isLoggedIn && !respondiendo ? (
                <form onSubmit={handleSubmit} className="comentario-form">
                    <textarea
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Escribe un comentario..."
                        rows="3"
                    />
                    <button type="submit">Comentar</button>
                </form>
            ) : !isLoggedIn && (
                <p className="no-logueado">Debes iniciar sesión para comentar</p>
            )}

            <div>
                {comentariosPadres.map(c => renderComentario(c))}
            </div>
        </div>
    );
}

export default Comentarios;