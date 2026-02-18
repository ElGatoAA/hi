import React from "react";

function OrdenarPor({ ordenActual, onCambiarOrden }) {
    const opciones = [
        { value: "alfabetico", label: "Alfabético" },
        { value: "salida", label: "Año de salida" },
        { value: "favoritos", label: "Más favoritos" },
        { value: "rating", label: "Mejor rating" }
    ];

    return (
        <div>
            <label>Ordenar por: </label>
            <select 
                value={ordenActual} 
                onChange={(e) => onCambiarOrden(e.target.value)}
            >
                {opciones.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default OrdenarPor;