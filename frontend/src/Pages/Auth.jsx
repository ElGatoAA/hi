import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import "../css/Auth.css";

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            navigate("/");
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.error || "Error en la autenticación");
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setFormData({ correo: "", usuario: "", contrasena: "" });
    };

    return (
        <div>
            <Nav />
            <div className="auth-container">
                <div className="auth-box">
                    <h1>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h1>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div>
                                <label>Correo</label>
                                <input
                                    type="email"
                                    name="correo"
                                    placeholder="correo@ejemplo.com"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label>Usuario</label>
                            <input
                                type="text"
                                name="usuario"
                                placeholder="Tu usuario"
                                value={formData.usuario}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="contrasena"
                                placeholder="Tu contraseña"
                                value={formData.contrasena}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <p className="auth-error">{error}</p>}
                        <button type="submit">
                            {isLogin ? "Iniciar Sesión" : "Registrarse"}
                        </button>
                    </form>

                    <p>
                        {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                        <span onClick={toggleMode}>
                            {isLogin ? "Regístrate" : "Inicia sesión"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Auth;