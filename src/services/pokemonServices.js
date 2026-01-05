const getEvolutionData = (evolutions) => {
    return evolutions.map(
        async (evolution) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.name}/`)
    )
}