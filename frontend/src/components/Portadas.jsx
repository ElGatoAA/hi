import React from "react";
import { Link } from "react-router-dom";
import "/src/css/Portadas.css";

function Portadas({img, name, number, id}) {
    return (
        <Link to={id}>
            <div className="portada">
                <img src={img} alt={name} />
                <div className="portada-nombre">
                    <p>{name} {number}</p>
                </div>
            </div>
        </Link>
    );
}

export default Portadas;