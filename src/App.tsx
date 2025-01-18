import { useEffect, useState } from "react";
import { getPokemon } from "./utils/api"; // Import the API function
import Layout from './Layout';
import { generateAddition } from "./utils/generateAddition";

function App() {
  const [pokemon1, setPokemon1] = useState<any>(null); // State for first Pokémon
  const [pokemon2, setPokemon2] = useState<any>(null); // State for second Pokémon
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [pokemonIds, setPokemonIds] = useState<[number, number]>([1, 3]); // State to store Pokémon IDs

  const [problems, setProblems] = useState([
    generateAddition(),
    generateAddition(),
    generateAddition(),
    generateAddition(),
  ]);
  const [currentProblem, setCurrentProblem] = useState(generateAddition()); // State for the current addition problem


  const handleNewProblems = () => {
    // Generate four new problems
    setProblems([
      generateAddition(),
      generateAddition(),
      generateAddition(),
      generateAddition(),
    ]);
  };

   // Fetch Pokémon data whenever the IDs change
  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true); // Set loading to true when fetching
      const [id1, id2] = pokemonIds;
      const [data1, data2] = await Promise.all([getPokemon(id1), getPokemon(id2)]); // Fetch both Pokémon in parallel
      setPokemon1(data1);
      setPokemon2(data2);
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchPokemons();
  }, [pokemonIds]); // Re-run effect when IDs change

  // Function to handle button click and change both Pokémon IDs
  const handleChangePokemons = () => {
    const nextId1 = Math.floor(Math.random() * 1025) + 1;
    const nextId2 = Math.floor(Math.random() * 1025) + 1;
    setPokemonIds([nextId1, nextId2]); // Update IDs to trigger the useEffect
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full bg-blue-100">
        {loading ? (
          <h1 className="text-4xl font-bold text-blue-600">Loading...</h1>
        ) : (
          <div>
            <div className=" h-28">
              <button
                onClick={handleChangePokemons}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
              >
                Try a different pokemon...
              </button>
            </div>
            <div className=" absolute left-2/3 ">
                    ATTACK{" "}
                    {pokemon1?.moves?.[0]?.move?.name
                      ? pokemon1.moves[0].move.name.toUpperCase()
                      : "No Move"}{" "}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-2 pl-8 pr-12 text-right">
                        <div className="inline-block">
                          <span>{currentProblem.num1}</span>
                          <span className="ml-1">+</span>
                        </div>
                        <div className="flex justify-end">
                          <span>{currentProblem.num2}</span>
                          <span className="ml-1">=</span>
                        </div>
                      </div>
                    </div>
              </div>
            
            {[pokemon1, pokemon2].map((pokemon, index) => (
              <div key={index} className={`mb-8 flex ${index === 1 ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <h1 className="text-1xl font-bold text-blue-600">
                    {pokemon.name.toUpperCase()} - {pokemon.id}
                  </h1>
                  <p className="text-lg">
                    Type: {pokemon.types[0].type.name}{" "}
                    {pokemon.types[1]
                      ? "Type 2: " + pokemon.types[1].type.name
                      : ""}
                  </p>
                  <h2 className="text-1xl font-bold text-blue-600">
                    {pokemon.stats[0].base_stat}
                  </h2>
                </div>
                <div className=" rounded w-40 h-40 flex justify-center items-center  flex-1">
                  <img
                    src={
                      pokemon.sprites.other["showdown"].front_default ||
                      pokemon.sprites.front_default
                    }
                    alt={pokemon.name}
                    className="w-36 max-h-36 object-contain"
                  />
                </div>
                
               
                
              </div>
            ))}
          </div>
        )}
        <div className="w-full h-52 bg-poke-grey text-white flex items-center justify-center">
          <div>
            {pokemon2 ? `What will ${pokemon2.name.toUpperCase()} do?` : "Loading Pokémon..."}
          </div>
          <div className="m-10 bg-white w-1/2 text-black rounded p-2 text-2xl">
            <ul className="grid grid-cols-2 gap-4">
              {problems.map((problem, index) => (
                <li className="p-2 pl-8 pr-12 text-right" key={index}>
                  <div className="flex float-left text-lg pt-6">
                    {pokemon2?.moves?.[index]?.move?.name
                      ? pokemon2.moves[index].move.name.toUpperCase()
                      : "No Move"}
                  </div>
                  <div className="inline-block">
                    <span>{problem.num1}</span>
                    <span className="ml-1">+</span>
                  </div>
                  <div className="flex justify-end">
                    <span>{problem.num2}</span>
                    <span className="ml-1">=</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
  
}

export default App;
