import { useEffect, useState } from 'react';
import { getPokemon } from './utils/api'; // Import the API function

function App() {
  const [pokemon, setPokemon] = useState<any>(null); // State to store Pokémon data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [pokemonId, setPokemonId] = useState<number>(1025); // State to store current Pokémon ID

  // Fetch Pokémon data whenever the pokemonId changes
  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true); // Set loading to true when fetching
      const data = await getPokemon(pokemonId); // Fetch Pokémon with the current ID
      setPokemon(data); // Set Pokémon data in state
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchPokemon();
  }, [pokemonId]); // Re-run effect when pokemonId changes

  // Function to handle button click and change the Pokémon ID
  const handleChangePokemon = () => {
    const nextId = Math.floor(Math.random() * 1025) + 1;
    setPokemonId(nextId); // Update the Pokémon ID to trigger the useEffect
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      {loading ? (
        <h1 className="text-4xl font-bold text-blue-600">Loading...</h1>
      ) : pokemon ? (
        <div>
          <h1 className="text-4xl font-bold text-blue-600">
            {pokemon.name.toUpperCase()}
          </h1>
          <img
            /*src={pokemon.sprites.front_default}*/
            src={pokemon.sprites.other["showdown"].front_default ? pokemon.sprites.other["showdown"].front_default  : pokemon.sprites.front_default  }
            alt={pokemon.name}
            className="w-40 h-40"
          />
          <p className="text-lg">Type: {pokemon.types[0].type.name} {pokemon.types[1] ? "Type 2: " + pokemon.types[1].type.name : ""}</p>
          <button
            onClick={handleChangePokemon}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Change Pokémon
          </button>
        </div>
      ) : (
        <h1 className="text-4xl font-bold text-red-600">Error fetching Pokémon</h1>
      )}
    </div>
  );
}

export default App;
