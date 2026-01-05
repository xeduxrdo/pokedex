import React, { use, useRef } from 'react';
import { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import PokemonModal from './PokemonModal';

// Initial number of Pokémon displayed
const INITIAL_LIMIT = 20;

// Number of Pokémon added on each infinite scroll step
const INCREASE_LIMIT = 20;

function Pokemons() {
  // Base list of Pokémon fetched from the API (name + url only)
  const [allPokemons, setAllPokemons] = useState([]);
  // Search text entered by the user
  const [pokemonName, setPokemonName] = useState('');
  // Current visible Pokémon limit (used for infinite scroll)
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  // Currently selected Pokémon to display in the modal
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  /*
   * Custom hook that observes when the sentinel
   * enters the viewport to trigger infinite scrolling
   */
  const { ref: targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
  });

  /*
   * Filters the base Pokémon list by name.
   * Runs on every render when pokemonName changes
   */
  const pokemonsByName = allPokemons.filter((pokemon) =>
    pokemon.name.includes(pokemonName)
  );

  /*
   * Increases the visible Pokémon limit when the sentinel
   * becomes visible (infinite scroll).
   * Ensures the limit never exceeds the filtered list length.
   */
  useEffect(() => {
    if (isIntersecting) {
      const maxPokemons = pokemonsByName.length;

      setLimit((prev) => {
        const newLimit = prev + INCREASE_LIMIT;

        // If newLimit exceeds the maximum, we return the maximum
        if (newLimit > maxPokemons) {
          return maxPokemons;
        }

        return newLimit;
      });
    }
  }, [isIntersecting, pokemonsByName.length]);

  /*
   * Resets the Pokémon limit when the search input changes
   * to avoid inconsistencies with infinite scrolling
   */
  useEffect(() => {
    setLimit(INITIAL_LIMIT);
  }, [pokemonName]);

  /*
   * Handles the search input change and normalizes
   * the value to lowercase for consistent filtering
   */
  const handleChangePokemonName = (e) =>
    setPokemonName(e.target.value.toLowerCase());

  /*
   * Fetches the complete Pokémon list on initial render.
   * Only basic data is retrieved to keep performance optimal.
   */
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?limit=1025'
        );
        if (!response.ok) throw new Error('Error en la respuesta');
        const data = await response.json();
        console.log('Pokemons traídos de la API:', data.results);
        setAllPokemons(data.results);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPokemons();
  }, []);

  /*
   * Selects a Pokémon from the evolution chain
   * and prepares the required data to open the modal
   */
  const handleSelectEvolution = (speciesName) => {
    setSelectedPokemon({
      name: speciesName,
      url: `https://pokeapi.co/api/v2/pokemon/${speciesName}`,
    });
  };

  return (
    <section className=''>
      {/* Pokémon search input */}
      <form>
        <div className='bg-white p-2 pl-4 rounded-xl sm:w-2/3 flex mx-auto text-zinc-700 text-lg font-semibold'>
          <input
            className='outline-none flex-1 capitalize'
            type='text'
            placeholder='Search your Pokemon'
            autoComplete='off'
            name='pokemonName'
            onChange={handleChangePokemonName}
          />
        </div>
      </form>
      {/* Pokémon list with dynamic limit */}
      <PokemonList
        pokemons={pokemonsByName.slice(0, limit)}
        onSelectPokemon={(p) => setSelectedPokemon(p)}
      />
      {/* Modal displaying the selected Pokémon details */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onSelectEvolution={handleSelectEvolution}
        />
      )}
      {/* Sentinel element used by Intersection Observer */}
      <span ref={targetRef}></span>
    </section>
  );
}

export default Pokemons;
