import React from "react";

function Button_Navigator({ currentPage, totalPages, onPageChange }) {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div>
            <button 
                onClick={handlePrevious} 
                disabled={currentPage === 1}
            >
                Anterior
            </button>
            <span>
                Página {currentPage} de {totalPages}
            </span>
            <button 
                onClick={handleNext} 
                disabled={currentPage === totalPages}
            >
                Siguiente
            </button>
        </div>
    );
}

export default Button_Navigator;