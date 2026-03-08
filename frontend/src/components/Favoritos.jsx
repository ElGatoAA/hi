import React, { useState } from "react";
import Portadas from "./Portadas";
import ButtonNavigator from "./Button_navigator";
import "../css/Perfil.css";

function Favoritos({ favoritos }) {
    const [currentPage, setCurrentPage] = useState(1);
    const favoritosPerPage = 20;

    const totalPages = Math.ceil(favoritos.length / favoritosPerPage);
    const indexOfLast = currentPage * favoritosPerPage;
    const indexOfFirst = indexOfLast - favoritosPerPage;
    const currentFavoritos = favoritos.slice(indexOfFirst, indexOfLast);

    if (favoritos.length === 0) {
        return (
            <div className="favoritos-container">
                <h2>Favoritos</h2>
                <p className="favoritos-vacio">No hay series en favoritos</p>
            </div>
        );
    }

    return (
        <div className="favoritos-container">
            <h2>Favoritos</h2>
            <div className="favoritos-grid">
                {currentFavoritos.map((favorito) => (
                    <Portadas 
                        key={favorito.id} 
                        img={`/src/assets/${favorito.img}`} 
                        name={favorito.name} 
                        id={`/serie/${favorito.id}`} 
                    />
                ))}
            </div>
            {favoritos.length > favoritosPerPage && (
                <ButtonNavigator 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}

export default Favoritos;