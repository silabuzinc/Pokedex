import React, { useState } from "react";

const PokemonForm = ({
  setPokemonId,
  setLoading,
  setError,
}: {
  setPokemonId: React.Dispatch<React.SetStateAction<number|string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [pokemon, setPokemon] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(pokemon !== ''){
      // Estara cargando por que hará una petición a la API
      setError(true)
      setLoading(true)
      const pokemonID = window.isNaN(parseInt(pokemon)) ? pokemon.toLowerCase() : pokemon
      setPokemonId(pokemonID);
      setPokemon('')
      return
    }
    setError(true) //Si manda el formulario vacío, hay un error
  };

  return (
    <form className="pokemon-form" onSubmit={handleSubmit}>
      <input
        className="pokemon-input"
        type="text"
        name="pokemon"
        value={pokemon}
        placeholder="Busca tu pokemon"
        //Actualizas el valor del input cuando el usuario ingresa un text
        onChange={(e) => setPokemon(e.target.value)}
        autoComplete="off"
      />
      <input type="submit" className="pokemon-btn" value=""/>
    </form>
  );
};

export default PokemonForm;
