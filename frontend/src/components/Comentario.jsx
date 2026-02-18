import React from "react";
import { Link } from "react-router-dom";

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
        
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short' 
        });
    };

    const esAutor = usuarioActual === comentario.usuario;

    return (
        <div style={{ marginBottom: "15px", borderLeft: "2px solid #ccc", paddingLeft: "10px" }}>
            <div>
                <Link to={`/perfil/${comentario.usuario}`}>
                    <img 
                        src={`/src/assets/pf/${comentario.imagen}`} 
                        alt={comentario.usuario}
                        width="30"
                        height="30"
                    />
                    <strong>{comentario.usuario}</strong>
                </Link>
                <span> · {formatearFecha(comentario.created_at)}</span>
            </div>
            <p>{comentario.mensaje}</p>
            <div>
                <button onClick={() => onResponder(comentario)}>
                    Responder
                </button>
                {esAutor && (
                    <button onClick={() => onEliminar(comentario.id)}>
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    );
}

export default Comentario;