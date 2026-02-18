import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Buscador from "./Buscador";

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <nav className="navbar">
        <Link to="/">
            <p>Home</p>
        </Link>
        <Link to="/directorio">
            <p>Directorio</p>
        </Link>
        <Buscador />
        {user ? (
          <Link to="/perfil">
            <img 
              src={`/src/assets/pf/${user.imagen}`} 
              alt={user.usuario}
              width="40"
              height="40"
            />
            <span>{user.usuario}</span>
          </Link>
        ) : (
          <Link to="/auth">
            <button>Login</button>
          </Link>
        )}
    </nav>
  );
}

export default Nav;