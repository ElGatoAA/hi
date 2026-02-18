import React from "react";
import { Link } from "react-router-dom";

function Portadas({img, name, number, id}) {
    return (
        <>
        <Link to={id}>
            <div className='portadas'>
                <img src={img} alt="/assets/dev.png" width={250} height={250} />
                <p>{name} {number}</p>
            </div>
        </Link>
       
        </>
    )
}

export default Portadas;