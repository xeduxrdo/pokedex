// Formats raw Pokémon stats into a simplified structure and adds a total stat.
export const formatStats = (stats) => {
  const nameTypes = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SA',
    'special-defense': 'SD',
    speed: 'SPD',
  };

  const newStats = stats.map(({ stat, base_stat }) => ({
    name: nameTypes[stat.name],
    base_stat,
  }));

  newStats.push({
    name: 'TOT',
    base_stat: newStats.reduce((acc, stat) => acc + stat.base_stat, 0),
  });

  return newStats;
};

// Extracts and returns the main Pokémon images (default, shiny and animated).
export const getPokemonImages = (images) => {
  if (!images) return null;

  return {
    default: images.sprites?.other?.['official-artwork']?.front_default ?? null,

    shiny: images.sprites?.other?.['official-artwork']?.front_shiny ?? null,

    animated:
      images.sprites?.versions?.['generation-v']?.['black-white']?.animated
        ?.front_default ?? null,
  };
};

// Formats Pokémon types into a simple array of type names.
export const formatTypes = (types) => types.map((type) => type.type.name);

// Formats Pokémon abilities into a readable list of ability names.
export const formatAbilities = (abilities) =>
  abilities.map((ability) => ability.ability.name);

// Retrieves the Pokédex entry text for a Pokémon species.
export const getPokemonEntry = (pokemonEntry) =>
  pokemonEntry.flavor_text_entries[1].flavor_text;

// Builds a complete evolution chain by recursively traversing
// all evolution stages (base, intermediate, final and branched evolutions)
export const getEvolutionChain = (chain) => {
  const evolutions = [];

  const traverse = (node, isBase = false) => {
    evolutions.push({
      species_name: node.species.name,
      min_level: node.evolution_details?.[0]?.min_level ?? null,
      trigger: node.evolution_details?.[0]?.trigger?.name ?? null,
      item: node.evolution_details?.[0]?.item?.name ?? null,
      isBase,
    });

    node.evolves_to.forEach((next) => traverse(next));
  };

  // Start from base Pokémon
  traverse(chain, true);

  return evolutions;
};

// Formats evolution requirements by replacing hyphens and capitalizing words.
export const formatEvolutionRequirement = (text) => {
  if (!text) return '';

  return text.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};
