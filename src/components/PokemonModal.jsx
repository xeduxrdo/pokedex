import React, { useState, useEffect } from 'react';
import {
  getPokemonImages,
  formatTypes,
  getPokemonEntry,
  formatAbilities,
  formatStats,
  getEvolutionChain,
  formatEvolutionRequirement,
} from '../helpers/pokemonFormat';
import { colorByType, colorByStat } from '../constants/pokemons';

function PokemonModal({ pokemon, onClose, onSelectEvolution }) {
  // Controls modal exit animation state
  const [isClosing, setIsClosing] = useState(false);
  // Controls modal visibility and entry animation
  const [isOpen, setIsOpen] = useState(false);
  // Detailed Pokémon data (stats, sprites, types, etc.)
  const [pokemonData, setPokemonData] = useState(null);
  // Species data (flavor text, evolution chain URL)
  const [speciesData, setSpeciesData] = useState(null);
  // Evolution chain raw data
  const [evolutionData, setEvolutionData] = useState(null);
  // Cached images for each evolution stage
  const [evolutionImages, setEvolutionImages] = useState([]);
  // Current sprite mode (default | shiny | animated)
  const [imageMode, setImageMode] = useState('default');
  /*
   * Derived / formatted data from helpers
   */
  const pokemonImages = getPokemonImages(pokemonData);
  const currentImage = pokemonImages?.[imageMode] ?? pokemonImages?.default;
  const types = pokemonData ? formatTypes(pokemonData.types) : [];
  const entries = speciesData ? getPokemonEntry(speciesData) : '';
  const abilities = pokemonData ? formatAbilities(pokemonData.abilities) : [];
  const stats = pokemonData ? formatStats(pokemonData.stats) : [];
  const evolutions = evolutionData
    ? getEvolutionChain(evolutionData.chain)
    : [];
  const firstType = pokemonData?.types?.[0]?.type?.name;

  /*
   * Fetches Pokémon details, species data,
   * and evolution chain when a Pokémon is selected
   */
  useEffect(() => {
    if (!pokemon) return;

    // Get the url of the pokemon details
    const fetchDetails = async () => {
      // Fetch Pokémon base data
      const res = await fetch(pokemon.url);
      const data = await res.json();
      console.log(data);
      setPokemonData(data);

      // Fetch species data (Pokedex entry, evolution URL)
      const speciesRes = await fetch(data.species.url);
      const speciesInfo = await speciesRes.json();
      setSpeciesData(speciesInfo);

      // Fetch evolution chain data
      const evolutionRes = await fetch(speciesInfo.evolution_chain.url);
      const evolutionInfo = await evolutionRes.json();
      setEvolutionData(evolutionInfo);
    };

    fetchDetails();
  }, [pokemon]);

  /*
   * Resets image mode when a new Pokémon is selected
   */
  useEffect(() => {
    setImageMode('default');
  }, [pokemon]);

  /*
   * Fetches images for each Pokémon in the evolution chain
   * to display evolution previews
   */
  useEffect(() => {
    const loadImages = async () => {
      if (!evolutionData) return;

      const imgs = {};

      for (const evo of getEvolutionChain(evolutionData.chain)) {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${evo.species_name}`
        );
        const data = await res.json();

        imgs[evo.species_name] =
          data.sprites.other['official-artwork'].front_default;
      }

      setEvolutionImages(imgs);
    };

    loadImages();
  }, [evolutionData]);

  /*
   * Triggers modal entry animation shortly after mount
   */
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 20);
    return () => clearTimeout(timer);
  }, []);

  /*
   * Handles modal close with exit animation
   */
  const handleClose = () => {
    setIsClosing(true);
    setIsOpen(false);

    setTimeout(() => {
      onClose();
    }, 500); // Matches CSS transition duration
  };

  /*
   * Prevents body scrolling while modal is open
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <section
      className={`
        fixed top-0 left-0 right-0 h-screen transition-all duration-500 flex justify-center 
        ${colorByType[firstType] || ''}
        ${!isOpen ? 'opacity-0 invisible' : 'opacity-100 visible'}
        ${isClosing ? 'opacity-0 invisible' : ''}
      `}>
      {/* Close modal button */}
      <button
        className='bg-neutral-800 absolute top-4 right-4 p-1 rounded-md hover:opacity-90 transition-opacity cursor-pointer'
        onClick={handleClose}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M18 6 6 18' />
          <path d='m6 6 12 12' />
        </svg>
      </button>
      {/* Main modal container */}
      <div
        className={`bg-neutral-800 h-[85%] absolute w-full rounded-tl-3xl rounded-tr-3xl text-center transition-all duration-500 flex flex-col max-w-2xl
        ${!isOpen ? '-bottom-full' : 'bottom-0'}
        ${isClosing ? 'opacity-0 invisible' : ''}`}>
        {/* Pokémon main image */}
        <div className='absolute left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <img
            className='h-40 w-40 object-contain group-hover:scale-105 transition-transform duration-300 ease-out'
            src={currentImage}
            alt={pokemonData?.name}
          />
        </div>

        {/* Image mode selector buttons */}
        <div className='flex justify-center gap-2 pt-22'>
          {/* Default / Shiny / Animated buttons */}
          {/* Default */}
          <button
            onClick={() => setImageMode('default')}
            className={`px-2 py-1 rounded text-sm font-semibold cursor-pointer
              ${
                imageMode === 'default'
                  ? 'bg-neutral-200 text-black'
                  : 'bg-neutral-700'
              }
            `}>
            Default
          </button>
          {/* Shiny */}
          <button
            onClick={() => setImageMode('shiny')}
            disabled={!pokemonImages?.shiny}
            className={`px-2 py-1 rounded text-sm font-semibold cursor-pointer
              ${
                imageMode === 'shiny'
                  ? 'bg-neutral-200 text-black'
                  : 'bg-neutral-700'
              }
              disabled:opacity-40
            `}>
            Shiny
          </button>
          {/* Animated */}
          <button
            onClick={() => setImageMode('animated')}
            disabled={!pokemonImages?.animated}
            className={`px-2 py-1 rounded text-sm font-semibold cursor-pointer
            ${
              imageMode === 'animated'
                ? 'bg-neutral-200 text-black'
                : 'bg-neutral-700'
            }
              disabled:opacity-40
            `}>
            Animated
          </button>
        </div>

        {/* Scrollable Pokémon information */}
        <div className='flex-1 min-h-0 px-4 pb-4 overflow-y-auto'>
          {/* Pokémon ID */}
          <p className='mt-4'>
            <span
              className='bg-neutral-900 text-neutral-300 text-sm font-semibold rounded-lg
            px-1.5'>
              N.º{pokemonData?.id.toString().padStart(4, '0')}
            </span>
          </p>

          {/* Pokémon name */}
          <h2 className='text-xl font-semibold capitalize mt-1 mb-1'>
            {pokemonData?.name}
          </h2>

          {/* Types */}
          <ul className='flex justify-center gap-2 capitalize font-bold mb-2'>
            {types.map((type) => (
              <li
                key={type}
                className={`px-1.5 rounded-md text-sm text-neutral-900
                            ${colorByType[type]}`}>
                {type}
              </li>
            ))}
          </ul>

          {/* Pokédex entry */}
          <div className='p-2 mb-2'>
            <h3 className='text-lg font-semibold'>Pokedex Entry</h3>
            <p className='text-left'>{entries}</p>
            {/* <p>{pokedexEntry || 'Loading entry...'}</p> */}
          </div>

          {/* Abilities and Height / Weight */}
          <div className='flex flex-col sm:flex-row gap-2 flex-wrap mb-2'>
            {/* Height / Weight */}
            <div className='flex justify-center gap-2 bg-neutral-900 rounded-lg p-2 flex-1'>
              <div>
                <h3 className='text-lg font-semibold'>Height</h3>
                <span className='bg-[#303030] rounded font-semibold px-2'>
                  {pokemonData?.height}
                </span>
              </div>
              <div>
                <h3 className='text-lg font-semibold'>Weight</h3>
                <span className='bg-[#303030] rounded font-semibold px-2'>
                  {pokemonData?.weight}
                </span>
              </div>
            </div>

            {/* Abilities */}
            <div className='bg-neutral-900 rounded-lg p-2 flex-1'>
              <h3 className='text-lg font-semibold'>Abilities</h3>
              <div>
                <ul className='flex justify-center gap-2 flex-wrap'>
                  {abilities.map((ability) => (
                    <li
                      key={ability}
                      className='capitalize bg-[#303030] rounded font-semibold px-2'>
                      {ability}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className='bg-neutral-900 rounded-lg p-2 mb-2'>
            <h3 className='text-lg font-semibold'>Stats</h3>
            <ul className='flex justify-center flex-wrap gap-2'>
              {stats.map((stat) => (
                <li
                  key={stat.name}
                  className='bg-[#303030] rounded-full text-sm text-neutral-300 font-semibold p-1'>
                  <div
                    className={`rounded-full w-7 aspect-square flex justify-center items-center text-neutral-900 ${
                      colorByStat[stat.name] || ''
                    }`}>
                    <span className='capitalize'>{stat.name}</span>
                  </div>
                  <span className=''>{stat.base_stat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Evolution chain */}
          <div className='bg-neutral-900 rounded-lg p-2'>
            <h3 className='text-lg font-semibold'>Evolution Chain</h3>
            <ul className='flex flex-wrap justify-center gap-2'>
              {evolutions.map((evo, index) => (
                <div
                  key={evo.species_name}
                  onClick={() => onSelectEvolution(evo.species_name)}
                  title={
                    evo.species_name.charAt(0).toUpperCase() +
                    evo.species_name.slice(1)
                  }
                  className='flex flex-col items-center cursor-pointer bg-[#303030] rounded-lg'>
                  <img
                    className='w-10 h-10'
                    src={evolutionImages[evo.species_name]}
                    alt={evo.species_name}
                  />
                  <p className='text-sm font-semibold'>
                    {evo.isBase
                      ? 'Base'
                      : evo.min_level
                      ? `Lvl ${evo.min_level}`
                      : evo.item
                      ? formatEvolutionRequirement(evo.item)
                      : evo.trigger
                      ? formatEvolutionRequirement(evo.trigger)
                      : ''}
                  </p>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PokemonModal;
