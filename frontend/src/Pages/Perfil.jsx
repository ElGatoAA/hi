import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import DetallesPerfil from "../components/DetallesPerfil";
import Favoritos from "../components/Favoritos";

function Perfil() {
    const [userData, setUserData] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [esPropietario, setEsPropietario] = useState(false);
    const navigate = useNavigate();
    const { usuario } = useParams(); // Si viene de /perfil/:usuario

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userLocal = localStorage.getItem("user");
        
        // Resetear estado al cambiar de perfil
        setEsPropietario(false);
        
        // Si no hay parámetro de usuario en la URL, es el perfil propio
        if (!usuario) {
            if (!token) {
                navigate("/auth");
                return;
            }
            cargarPerfilPropio(token);
            setEsPropietario(true);
        } else {
            // Es el perfil de otro usuario
            cargarPerfilPublico(usuario);
            
            // Verificar si es el propietario
            if (userLocal) {
                const user = JSON.parse(userLocal);
                setEsPropietario(user.usuario === usuario);
            }
        }
    }, [usuario]);

    const cargarPerfilPropio = async (token) => {
        try {
            // Cargar datos del perfil
            const perfilResponse = await axios.get(
                "http://localhost:3000/perfil",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserData(perfilResponse.data);

            // Cargar favoritos
            const favoritosResponse = await axios.get(
                "http://localhost:3000/favoritos",
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
            // Cargar datos del perfil público
            const perfilResponse = await axios.get(
                `http://localhost:3000/perfil/${nombreUsuario}`
            );
            setUserData(perfilResponse.data);

            // Cargar favoritos públicos
            const favoritosResponse = await axios.get(
                `http://localhost:3000/favoritos/${nombreUsuario}`
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
            <DetallesPerfil 
                usuario={userData.usuario}
                correo={userData.correo}
                imagen={userData.imagen}
                created_at={userData.created_at}
                esPropietario={esPropietario}
            />
            <Favoritos favoritos={favoritos} />
        </div>
    );
}

export default Perfil;