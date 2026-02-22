import React from "react";
import { Link } from "react-router-dom";
import "../css/Comentarios.css";

function Comentario({ comentario, onResponder, onEliminar, usuarioActual }) {
    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const ahora = new Date();
        const diff = ahora - date;

        const minutos = Math.floor(diff / 60000);
        const horas = Math.floor(diff / 3600000);
        const dias = Math.floor(diff / 86400000);

        if (minutos < 1) return "Ahora";
        if (minutos < 60) return `${minutos}m`;
        if (horas < 24) return `${horas}h`;
        if (dias < 7) return `${dias}d`;

        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    const esAutor = usuarioActual === comentario.usuario;

    return (
        <div className="comentario-item">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link to={`/perfil/${comentario.usuario}`} className="comentario-autor">
                    <img src={`/src/assets/pf/${comentario.imagen}`} alt={comentario.usuario} />
                    <strong>{comentario.usuario}</strong>
                    <span>{formatearFecha(comentario.created_at)}</span>
                </Link>
            </div>
            <p className="comentario-mensaje">{comentario.mensaje}</p>
            <div className="comentario-acciones">
                <button onClick={() => onResponder(comentario)}>Responder</button>
                {esAutor && (
                    <button onClick={() => onEliminar(comentario.id)}>Eliminar</button>
                )}
            </div>
        </div>
    );
}

export default Comentario;