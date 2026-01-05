import React from 'react';
import PokemonPreview from './PokemonPreview';

// Renders the list of pokemon cards
// Receives the filtered pokemon list and a callback to select one
function PokemonList({ pokemons, onSelectPokemon }) {
  return (
    // Container for all pokemon previews
    <section className='pt-4 flex flex-wrap gap-4 justify-center'>
      {pokemons.map((pokemon) => (
        <PokemonPreview
          key={pokemon.url} // Unique key based on pokemon api url
          pokemonURL={pokemon.url} // URL used to fetch pokemon details
          onSelectPokemon={() => onSelectPokemon(pokemon)} // Notify parent when a pokemon is selected
        />
      ))}
    </section>
  );
}

export default PokemonList;
