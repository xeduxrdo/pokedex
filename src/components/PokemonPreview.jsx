import React, { useState, useEffect } from 'react';
import { colorByType, styleByType } from '../constants/pokemons';

// Displays a single pokemon preview card
// Fetches pokemon data using the provided url
function PokemonPreview({ pokemonURL, onSelectPokemon }) {
  const [pokemon, setPokemon] = useState(null);

  // Fetches individual pokemon data using its specific url
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(pokemonURL);
        if (!response.ok) throw new Error('Error en la respuesta');
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPokemon();
  }, []);

  // Gets the first pokemon type to apply styles
  const firstType = pokemon?.types?.[0]?.type?.name;

  return (
    // Main pokemon card container
    <article
      onClick={() => onSelectPokemon(pokemon)}
      className={`w-full xs:w-48 bg-neutral-800 rounded-lg cursor-pointer
    ${styleByType[firstType] || ''}
    transition-all duration-300 ease-out
    group`}>
      {/* Pokemon id */}
      <p className='mt-2 mb-2 ml-2'>
        <span className='bg-neutral-300 text-neutral-800 text-sm font-bold rounded-lg px-1.5'>
          N.º{pokemon?.id.toString().padStart(4, '0')}
        </span>
      </p>
      {/* Pokemon image */}
      <div className='flex justify-center'>
        <img
          className='h-40 w-40 object-contain group-hover:scale-105 transition-transform duration-300 ease-out'
          src={pokemon?.sprites.other['official-artwork'].front_default}
          alt={pokemon?.name}
        />
      </div>
      {/* Pokemon name */}
      <h4 className='text-center capitalize text-xl font-bold mt-1'>
        {pokemon?.name}
      </h4>
      {/* Pokemon types */}
      <ul className='flex justify-center gap-2 mt-1 mb-3 capitalize font-bold'>
        {pokemon?.types.map((typeName) => (
          <li
            className={`px-1.5 rounded-md text-sm text-neutral-900
              ${colorByType[typeName.type.name]}`}
            key={typeName.type.name}>
            {typeName.type.name}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default PokemonPreview;
