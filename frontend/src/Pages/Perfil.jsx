import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import DetallesPerfil from "../components/DetallesPerfil";
import Favoritos from "../components/Favoritos";
import "../css/Perfil.css";
import API_URL from "../config";

function Perfil() {
    const [userData, setUserData] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [esPropietario, setEsPropietario] = useState(false);
    const navigate = useNavigate();
    const { usuario } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userLocal = localStorage.getItem("user");
        
        setEsPropietario(false);
        
        if (!usuario) {
            if (!token) {
                navigate("/auth");
                return;
            }
            cargarPerfilPropio(token);
            setEsPropietario(true);
        } else {
            cargarPerfilPublico(usuario);
            if (userLocal) {
                const user = JSON.parse(userLocal);
                setEsPropietario(user.usuario === usuario);
            }
        }
    }, [usuario]);

    const cargarPerfilPropio = async (token) => {
        try {
            const perfilResponse = await axios.get(
                `${API_URL}/perfil`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserData(perfilResponse.data);

            const favoritosResponse = await axios.get(
                `${API_URL}/favoritos`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFavoritos(favoritosResponse.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/auth");
            }
        }
    };

    const cargarPerfilPublico = async (nombreUsuario) => {
        try {
            const perfilResponse = await axios.get(
                `${API_URL}/perfil/${nombreUsuario}`
            );
            setUserData(perfilResponse.data);

            const favoritosResponse = await axios.get(
                `${API_URL}/favoritos/${nombreUsuario}`
            );
            setFavoritos(favoritosResponse.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            if (error.response?.status === 404) {
                alert("Usuario no encontrado");
                navigate("/");
            }
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (!userData) return null;

    return (
    <div>
        <Nav />
        <div className="perfil-layout">
            <DetallesPerfil 
                usuario={userData.usuario}
                correo={userData.correo}
                imagen={userData.imagen}
                created_at={userData.created_at}
                esPropietario={esPropietario}
            />
            <Favoritos favoritos={favoritos} />
        </div>
    </div>
);
}

export default Perfil;