import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CambiarFotoPerfil from "./CambiarFotoPerfil";
import "../css/Perfil.css";

function DetallesPerfil({ usuario, correo, imagen, created_at, esPropietario = false }) {
    const [imagenActual, setImagenActual] = useState(imagen);
    const navigate = useNavigate();

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };

    const handleFotoCambiada = (nuevaImagen) => {
        setImagenActual(nuevaImagen);
    };

    return (
        <div className="perfil-container">
            <img 
                src={`/src/assets/pf/${imagenActual}`} 
                alt={usuario}
                className="perfil-avatar"
            />
            <div className="perfil-info">
                <h2>{usuario}</h2>
                {esPropietario && <p>{correo}</p>}
                <p>Miembro desde {formatearFecha(created_at)}</p>
                {esPropietario && (
                    <div className="perfil-acciones">
                        <CambiarFotoPerfil imagenActual={imagenActual} onFotoCambiada={handleFotoCambiada} />
                        <button onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetallesPerfil;