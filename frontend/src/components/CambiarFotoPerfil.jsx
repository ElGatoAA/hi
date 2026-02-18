import React, { useState } from "react";
import axios from "axios";

function CambiarFotoPerfil({ imagenActual, onFotoCambiada }) {
    const [mostrarSelector, setMostrarSelector] = useState(false);
    const [subiendo, setSubiendo] = useState(false);

    const handleSubirFoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen no puede superar 5MB");
            return;
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
            alert("Solo se permiten imágenes");
            return;
        }

        setSubiendo(true);

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append('foto', file);

            const response = await axios.post(
                "http://localhost:3000/subir-foto-perfil",
                formData,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );

            // Actualizar localStorage
            const user = JSON.parse(localStorage.getItem("user"));
            user.imagen = response.data.imagen;
            localStorage.setItem("user", JSON.stringify(user));

            setMostrarSelector(false);
            onFotoCambiada(response.data.imagen);
            alert("Foto subida exitosamente");
        } catch (error) {
            console.error("Error al subir foto:", error);
            alert(error.response?.data?.error || "Error al subir foto");
        } finally {
            setSubiendo(false);
        }
    };

    const handleUsarDefault = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:3000/usar-foto-default",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Actualizar localStorage
            const user = JSON.parse(localStorage.getItem("user"));
            user.imagen = response.data.imagen;
            localStorage.setItem("user", JSON.stringify(user));

            setMostrarSelector(false);
            onFotoCambiada(response.data.imagen);
            alert("Foto de perfil restablecida");
        } catch (error) {
            console.error("Error al usar foto default:", error);
            alert(error.response?.data?.error || "Error al cambiar foto");
        }
    };

    return (
        <div>
            <button onClick={() => setMostrarSelector(!mostrarSelector)}>
                {mostrarSelector ? "Cancelar" : "Cambiar foto de perfil"}
            </button>

            {mostrarSelector && (
                <div>
                    <h3>Cambiar foto de perfil:</h3>
                    
                    <div>
                        <h4>Subir tu propia foto:</h4>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleSubirFoto}
                            disabled={subiendo}
                        />
                        {subiendo && <p>Subiendo...</p>}
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <h4>O usar la foto por defecto:</h4>
                        <button onClick={handleUsarDefault}>
                            Usar foto por defecto
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CambiarFotoPerfil;