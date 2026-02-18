import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CambiarFotoPerfil from "./CambiarFotoPerfil";

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
        window.location.reload(); // Recargar para actualizar el Nav
    };

    const handleFotoCambiada = (nuevaImagen) => {
        setImagenActual(nuevaImagen);
    };

    return (
        <div>
            <h2>Perfil de {usuario}</h2>
            <img 
                src={`/src/assets/pf/${imagenActual}`} 
                alt={usuario}
                width="100"
                height="100"
            />
            {esPropietario && <CambiarFotoPerfil imagenActual={imagenActual} onFotoCambiada={handleFotoCambiada} />}
            <p>Usuario: {usuario}</p>
            {esPropietario && <p>Correo: {correo}</p>}
            <p>Fecha de creación: {formatearFecha(created_at)}</p>
            {esPropietario && <button onClick={handleLogout}>Cerrar Sesión</button>}
        </div>
    );
}

export default DetallesPerfil;