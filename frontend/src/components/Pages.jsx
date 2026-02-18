import React from "react";
import Portadas from "../components/Portadas";
import ButtonNavigator from "../components/Button_navigator";
import { useState, useEffect } from "react";
import axios from "axios";

function Pages({ searchTerm = "", generoId = "", ordenarPor = "alfabetico" }) {
    const [series, setSeries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const seriesPerPage = 8;

    useEffect(() => {
        // Si hay un género seleccionado, buscar series por género
        if (generoId) {
            axios.get(`http://localhost:3000/seriesPorGenero/${generoId}?orderBy=${ordenarPor}`).then((response) => {
                setSeries(response.data);
            });
        } else {
            // Si no, traer todas las series
            axios.get(`http://localhost:3000/series?orderBy=${ordenarPor}`).then((response) => {
                setSeries(response.data);
            });
        }
    }, [generoId, ordenarPor]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, generoId, ordenarPor]);

    // Filtrar series según el término de búsqueda (solo si no hay género seleccionado)
    // Solo coincide si alguna palabra comienza con el término buscado
    const filteredSeries = !generoId && searchTerm
        ? series.filter((serie) => {
              const words = serie.name.toLowerCase().split(/\s+/);
              const search = searchTerm.toLowerCase();
              return words.some(word => word.startsWith(search));
          })
        : series;

    // Calcular el total de páginas
    const totalPages = Math.ceil(filteredSeries.length / seriesPerPage);

    // Obtener las series de la página actual
    const indexOfLastSeries = currentPage * seriesPerPage;
    const indexOfFirstSeries = indexOfLastSeries - seriesPerPage;
    const currentSeries = filteredSeries.slice(indexOfFirstSeries, indexOfLastSeries);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (!series || series.length === 0) return <p>Cargando...</p>;

    if (searchTerm && filteredSeries.length === 0) {
        return <p>Ninguna serie encontrada</p>;
    }

    if (filteredSeries.length === 0) return null;

    return (
        <div>
            <div>
                {currentSeries.map((item) => (
                    <Portadas 
                        key={item.id} 
                        img={`/src/assets/${item.img}`} 
                        name={item.name} 
                        id={`/serie/${item.id}`} 
                    />
                ))} 
            </div>
            
            {filteredSeries.length > seriesPerPage && (
                <ButtonNavigator 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}

export default Pages;