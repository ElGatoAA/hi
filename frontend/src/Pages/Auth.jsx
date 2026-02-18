import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        correo: "",
        usuario: "",
        contrasena: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const endpoint = isLogin ? "/login" : "/registro";
            const data = isLogin 
                ? { usuario: formData.usuario, contrasena: formData.contrasena }
                : formData;

            const response = await axios.post(`http://localhost:3000${endpoint}`, data);
            
            // Guardar token en localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            // Redirigir al home
            navigate("/");
            window.location.reload(); // Recargar para actualizar el Nav
        } catch (err) {
            setError(err.response?.data?.error || "Error en la autenticación");
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setFormData({
            correo: "",
            usuario: "",
            contrasena: ""
        });
    };

    return (
        <div>
            <Nav />
            <div>
                <h1>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h1>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div>
                            <label>Correo:</label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label>Usuario:</label>
                        <input
                            type="text"
                            name="usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <p>{error}</p>}
                    <button type="submit">
                        {isLogin ? "Iniciar Sesión" : "Registrarse"}
                    </button>
                </form>
                <p>
                    {isLogin ? "¿Aún no tienes una cuenta? " : "¿Ya tienes una cuenta? "}
                    <span onClick={toggleMode} style={{ cursor: "pointer", textDecoration: "underline" }}>
                        {isLogin ? "Regístrate" : "Inicia sesión"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Auth;