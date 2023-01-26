# Taller

Para este taller crearemos una pokedex haciendo uso de la PokeApi y con la funcionalidad de guardar nuestros favoritos en Supabase.

## Configuración del proyecto

Para crear el proyecto haremos uso de React con Typescript.

```console
npx create-react-app nombre-de-tu-proyecto --template typescript
```

Una vez creada nuestra aplicación crearemos una carpeta `img` dentro de `src` donde almacenaremos los siguientes Gif's.

* [Error](https://thumbs.gfycat.com/BowedIckyLacewing-size_restricted.gif)

* [Carga](https://cdn.dribbble.com/users/621155/screenshots/2835314/simple_pokeball.gif)

## Creando pokedex

Ahora que tenemos almacenadas ambas imágenes, crearemos la carpeta `components` dentro de `src`.

Dentro de esta carpeta crearemos el archivo `Pokedex.tsx` y añadimos el siguiente código:

```tsx
import React from 'react';
import PokedexScreen from './PokedexScreen';
import PokemonForm from './PokemonForm';

function Pokedex(){
  return (
    <div className="pokedex">
      <div className="pokedex-left">
        <div className="pokedex-left-top">
          <div className='light is-sky is-big'/>
          <div className="light is-red" />
          <div className="light is-yellow" />
          <div className="light is-green" />
        </div>
        <div className="pokedex-screen-container">
          <PokedexScreen />
        </div>
        <div className="pokedex-left-bottom">
          <div className="pokedex-left-bottom-lights">
            <div className="light is-blue is-medium" />
            <div className="light is-green is-large" />
            <div className="light is-orange is-large" />
          </div>
          <PokemonForm />
        </div>
      </div>
      <div className="pokedex-right-front" />
      <div className="pokedex-right-back" />
    </div>
  )
}

export default Pokedex;
```

Ahora importaremos los estilos, haremos uso del siguiente gist:

* [Gist de Css](https://gist.github.com/marcelo130102/dd8943285c77926c7955c37c8ab5ebce)

El código lo añadiremos en la ruta `src/styles/pokedex.css` (crear la carpeta y el archivo).

Una vez añadidos los estilos lo podremos importar dentro de `Pokedex.tsx`

```tsx
import '../styles/pokedex.css';
```

Nuestra Pokedex tendrá 4 estados:

* `loading`: Cuando se busca al Pokemón, este será verdadero.

* `error`: Si ocurre un error en API o algún error de red, este será verdadero.

* `pokemon`: Almacenará los datos de nuestro Pokemón.

* `pokemonID`: Almacenará el ID o el nombre del Pokemón que buscamos.

Además, crearemos una función que retornará un número aleatorio para mostrar un Pokemón distinto cada vez que se haga la carga.

```ts
// Creamos un número aleatorio entre el 1 y el 807
const RandomId = Math.floor(Math.random() * 806 + 1)
```

Este valor va desde el 1 al 807.

Luego, crearemos todos los estados a utilizar dentro de nuestro componente `Pokedex`.

```ts
import { useState } from 'react';

const Pokedex = () => {
  const [ error, setError ] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ pokemon, setPokemon ] = useState(null);
  const randomId = Math.floor(Math.random() * 806 + 1);
  const [pokemonID, setPokemonId] = useState<number | string>(randomId);

  return ( //...
}
```

### ¿Cómo traemos datos de la API?

La ruta a utilizar será la siguiente:

```url
https://pokeapi.co/api/v2/pokemon/${pokemonId}
```

Usaremos el valor de nuestro estado para colocarlo en el parámetro de `pokemonId`. Para eso haremos el uso de un hook de React, el cual es `useEffect`. El código es el siguiente:

```tsx
import { useState, useEffect } from "react";
const Pokedex = () => {
  // ...

  // Solamente esta cargando mientras hacemos la petición,
  // cuando esta se resuelve o fue un éxito u un error.
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`)
      .then(res => res.json())
      .then(data => {
        // Si todo esta cool, actualizamos el pokemón
        // Y le indicamos que no hay error
        setPokemon(data)
        setLoading(false)
        setError(false)
      })
      .catch(err => {
        setLoading(false)
        setError(true)
      })
  }, [pokemonID]);

  // RETURN
}
```

Esto lo añadimos a nuestro componente `Pokedex` en medio de los state y el return.

### Enviando información a PokedexScreen

Ahora que tenemos los datos, ¿cómo los enviamos?. A cada componente de React podemos enviarles parámetros, para `PokedexScreen` sería de la siguiente forma:

```tsx
//...
  <PokedexScreen
    pokemon={pokemon}
    loading={loading}
    error={error}
  />
//...
```

Enviamos el estado de carga, si hay error y la información del Pokemón.

Como ya tenemos los parámetros listo, crearemos el componente, añadimos el archivo `PokedexScreen.tsx` dentro de `components`. Este debe contener el siguiente código.

```tsx
import React from "react";
import ErrorPokemon from "../img/error.gif";
import LoadingPokemon from "../img/carga.gif";
import { PokemonType } from "../interface/Pokemon";

import "../styles/pokedex.css";

const PokedexScreen = ({
  pokemon,
  loading,
  error,
}: {
  pokemon: PokemonType | null;
  loading: Boolean;
  error: Boolean;
}) => {
  return (
    <div className="pokedex-screen">
      <div className="pokemon-info">
        <h2 className="pokemon-name">{pokemon?.name}</h2>
        <img
          className="pokemon-img"
          src={pokemon?.sprites.front_default}
          alt={pokemon?.name}
        />
        <ul className="pokemon-stats">
          // Aquí iteraremos sobre la lista de estadísticas
        </ul>
      </div>
    </div>
  );
};

export default PokedexScreen;
```

> El uso de null es en caso de que no llegue ningún dato a nuestro componente

Necesitamos definir `PokemonType` como un interface dentro de nuestro proyecto para que podamos utilizar sus tipos.

Dentro de `src`, creamos la carpeta `interface`. Dentro de esta carpeta creamos el archivo `Pokemon.ts`, el cual contednrá el siguiente código.

```ts
export interface PokemonType {
    name: string,
    sprites: {
        back_default: string,
        front_default: string,
        
    }
}
```

> Este archivo se modificará para añadir nuevos tipos en base a lo que necesitemos

Ahora que añadimos el tipo modificamos el state de `Pokedex.tsx`.

```tsx
import { PokemonType } from "../interface/Pokemon";

const Pokedex = () => {
  // ...
  const [pokemon, setPokemon] = useState<PokemonType| null>(null);
  // return( ...
}
```

### Renderizando lista de atributos

Para hacer el recorrido de la lista, haremos uso de `array.map`, entonces para esto, crearemos el archivo `Stat.tsx` dentro de `components`. Este archivo tendrá lo siguiente.

```tsx
import React from 'react'
import { ItemStat } from '../interface/Pokemon'

const Stat = ({ item }:{ item:ItemStat }) =>{
  return (
    <li className="pokemon-stat">
      <span className="stat-name"><b>{item.stat.name}: </b></span>
      <span>{item.base_stat}</span>
    </li>
  )
}

export default Stat;
```

Añadimos el nuevo interface dentro de `src/interface/Pokemon.ts`

```ts
export interface ItemStat{
  base_stat: string,
  stat: {
    name: string,
  }   
}
```

Luego, añadimos el mapeo de la lista dentro de `PokedexScreen.tsx` en la sección donde aparece el comentario que indica que se añadirá la lista de stats:

```tsx
<ul className="pokemon-stats">
    {pokemon?.stats.map((item) => (
    <Stat key={item.stat.name} item={item} />
    ))}
</ul>
```

Importan el componente.

```tsx
import Stat from "./Stat";
```

Con esto, necesitamos modificar nuestro `PokemonType` para admitir el tipo de `state`. Por lo que, modificamos nuestro interface:

```ts
export interface PokemonType {
  name: string;
  sprites: {
    back_default: string;
    front_default: string;
  };
  stats: ItemStat[];
}
```

### Componentes con condiciones

Ahora necesitamos utilizar los Gif's que guardamos para definir los distinto estados de nuestra Pokedes. Por lo que, haremos uso de condicionales al momento de renderizar el componente `PokedexScreen`.

Si existe algún error...

```tsx
  // Si hay un error en la petición a la API, devuelve este componente.
  // Recuerda que al hacer un return, el resto de código, no se ejecutará.
  if(error){
    return (
      <div className="pokedex-screen">
        <img
          src={ErrorPokemon}
          alt="Hubo un error buscando tu pokemon"
          className="pokedex-no-screen"
        />
      </div>
    )
  }
```

Si no hay error, preparamos otro condicional que indique si esta `loading` o no:

```tsx
  // Si ya pasamos la validación del error...
  return (
    <div className="pokedex-screen">
      { !pokemon || loading ? // Si no hay pokemon o si esta cargando
        <img
          src={LoadingPokemon}
          alt="Aun no hay ningun pokemon"
          className="pokedex-no-screen"
        /> : // Todo bien, entonces retornamos el pokemón
        <div className="pokemon-info">
          <h2 className="pokemon-name">{pokemon.name}</h2>
          <img
            className="pokemon-img"
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <ul className="pokemon-stats">
            {pokemon.stats.map(item => <Stat key={item.stat.name} item={item}/>)}
          </ul>
        </div>
      }
    </div>
  )
```

Por lo que nuestro componente `PokedexScreen` quedaría de la siguiente forma:

```tsx
import React from "react";
import ErrorPokemon from "../img/error.gif";
import LoadingPokemon from "../img/carga.gif";
import { PokemonType } from "../interface/Pokemon";
import Stat from "./Stat";

import "../styles/pokedex.css";

const PokedexScreen = ({
  pokemon,
  loading,
  error,
}: {
  pokemon: PokemonType | null;
  loading: Boolean;
  error: Boolean;
}) => {
  // Si hay un error en la petición a la API, devuelve este componente.
  // Recuerda que al hacer un return, el resto de código, no se ejecutará.
  if(error){
    return (
      <div className="pokedex-screen">
        <img
          src={ErrorPokemon}
          alt="Hubo un error buscando tu pokemon"
          className="pokedex-no-screen"
        />
      </div>
    )
  }

  // Si ya pasamos la validación del error...
  return (
    <div className="pokedex-screen">
      { !pokemon || loading ? // Si no hay pokemon o si esta cargando
        <img
          src={LoadingPokemon}
          alt="Aun no hay ningun pokemon"
          className="pokedex-no-screen"
        /> : // Todo cool, entonces devuelve un lindo pokemon
        <div className="pokemon-info">
          <h2 className="pokemon-name">{pokemon.name}</h2>
          <img
            className="pokemon-img"
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
          />
          <ul className="pokemon-stats">
            {pokemon.stats.map(item => <Stat key={item.stat.name} item={item}/>)}
          </ul>
        </div>
      }
    </div>
  )
};

export default PokedexScreen;
```

## Estilos con condiciones

Ahora añadiremos las animaciones para nuestra Pokedex, dentro de `Pokedex.tsx` modificaremos el div de `pokedex-left-top`

```tsx
<div className="pokedex-left-top">
  <div className={`light is-sky is-big ${loading && 'is-animated'}`}  />
  <div className="light is-red" />
  <div className="light is-yellow" />
  <div className="light is-green" />
</div>
```

## Eventos del DOM y formularios

Crearemos un pequeño formulario el cual tendrá un input de texto y un botón para buscar a los pokemones:

```text
//Ambas son válidas
'pokeapi.co/api/v2/pokemon/25'

'pokeapi.co/api/v2/pokemon/pikachu'
```

En algún punto validaremos si el usuario ingresó un número o un nombre, en caso de un nombre debemos ponerlo todo en minúsculas.

### Manejo de INputs y eventos del DOM con React

Crearemos el archivo `PokemonForm.tsx` dentro de components, el cual contendrá el siguiente código.

```tsx
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
    e.preventDefault();
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
      <input type="submit" className="pokemon-btn" value="" />
    </form>
  );
};

export default PokemonForm;
```

Y dentro de `Pokedex.tsx`, modificamos los parámetro que recibe `PokemonForm`:

```tsx
<PokemonForm
  setPokemonId={setPokemonId}
  setLoading={setLoading}
  setError={setError}
/>
```

Y por último modificamos el `handlesubmit` de `PokemonForm`

```tsx
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
```

## Probando pokedex

Dentro de `App.tsx` colocalos el siguiente código.

```tsx
import React from 'react';
import './App.css';
import Pokedex from './components/Pokedex';

function App() {
  return (
    <Pokedex/>
  );
}

export default App;
```

Ahora para ejecutarla dentro de la consola ingresamos:

```console
npm start
```

Una vez ejecutado, podemos observar lo siguiente
