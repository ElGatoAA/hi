import React, { useState } from "react";
import Portadas from "./Portadas";
import ButtonNavigator from "./Button_navigator";

function Favoritos({ favoritos }) {
    const [currentPage, setCurrentPage] = useState(1);
    const favoritosPerPage = 15;

    // Calcular el total de páginas
    const totalPages = Math.ceil(favoritos.length / favoritosPerPage);

    // Obtener los favoritos de la página actual
    const indexOfLastFavorito = currentPage * favoritosPerPage;
    const indexOfFirstFavorito = indexOfLastFavorito - favoritosPerPage;
    const currentFavoritos = favoritos.slice(indexOfFirstFavorito, indexOfLastFavorito);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (favoritos.length === 0) {
        return <p>No tienes series en favoritos</p>;
    }

    return (
        <div>
            <h2>Mis Favoritos</h2>
            <div>
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
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}

export default Favoritos;