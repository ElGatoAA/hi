import React from "react";
import "../css/Filtros.css";

function OrdenarPor({ ordenActual, onCambiarOrden, isOpen, onToggle }) {
    const opciones = [
        { value: "alfabetico", label: "Alfabético" },
        { value: "salida", label: "Año de salida" },
        { value: "favoritos", label: "Más favoritos" },
        { value: "rating", label: "Mejor rating" }
    ];

    const labelActual = opciones.find(o => o.value === ordenActual)?.label || "Ordenar por";

    const handleClick = (value) => {
        onCambiarOrden(value);
        onToggle(false);
    };

    return (
        <div className="generos-wrapper">
            <button className={`generos-btn ${isOpen ? "generos-btn-activo" : ""}`} onClick={() => onToggle(!isOpen)}>
                {labelActual}
            </button>
            {isOpen && (
                <div className="generos-dropdown">
                    {opciones.map((opcion) => (
                        <p key={opcion.value} onClick={() => handleClick(opcion.value)}>
                            {opcion.label}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrdenarPor;