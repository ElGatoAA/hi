import React, { useState } from "react";
import axios from "axios";

function CambiarFotoPerfil({ imagenActual, onFotoCambiada }) {
    const [mostrarSelector, setMostrarSelector] = useState(false);
    const [subiendo, setSubiendo] = useState(false);

    const handleSubirFoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen no puede superar 5MB");
            return;
        }

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

            const user = JSON.parse(localStorage.getItem("user"));
            user.imagen = response.data.imagen;
            localStorage.setItem("user", JSON.stringify(user));

            setMostrarSelector(false);
            onFotoCambiada(response.data.imagen);
        } catch (error) {
            console.error("Error al subir foto:", error);
            alert(error.response?.data?.error || "Error al subir foto");
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div>
            <button onClick={() => setMostrarSelector(!mostrarSelector)}>
                {mostrarSelector ? "Cancelar" : "Cambiar foto de perfil"}
            </button>

            {mostrarSelector && (
                <div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleSubirFoto}
                        disabled={subiendo}
                    />
                    {subiendo && <p>Subiendo...</p>}
                </div>
            )}
        </div>
    );
}

export default CambiarFotoPerfil;