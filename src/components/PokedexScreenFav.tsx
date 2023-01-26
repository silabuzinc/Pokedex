import React, { useState } from "react";
import { fav } from "./utils/favorite";

import "../styles/pokedex.css";

const PokedexScreenFav = () => {
  // Si hay un error en la petición a la API, devuelve este componente.
  // Recuerda que al hacer un return, el resto de código, no se ejecutará.
  // Si ya pasamos la validación del error...
  const [favPoke, setFav] = useState(fav);
  return (
    <div className="pokedex-screen">
        <div className="pokemon-info">
          <h2 className="pokemon-name">Favoritos</h2>
          <ul className="pokemon-stats">
            {favPoke.map((item) => (
              <li className="pokemon-stat">
                <span className="stat-name">
                  <b>{item}</b>
                </span>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default PokedexScreenFav;
