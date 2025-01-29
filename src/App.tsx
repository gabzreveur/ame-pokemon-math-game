import { useEffect, useState } from "react";
import { getPokemon } from "./utils/api"; // Import the API function
import Layout from './Layout';
import { generateAddition } from "./utils/generateAddition";

function App() {
  const [pokemon1, setPokemon1] = useState<any>(null); // State for first Pokémon
  const [pokemon2, setPokemon2] = useState<any>(null); // State for second Pokémon
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [pokemonIds, setPokemonIds] = useState<[number, number]>([58, 155]); // State to store Pokémon IDs
  const [attackAnim, setAttackAnim] = useState<any>(null);


  const [activeIndex, setActiveIndex] = useState<any>(null); // State to track active <li>

  // Set initial Pokémon IDs on component mount
  useEffect(() => {
    handleChangePokemons();
  }, []); // Empty dependency array ensures this runs only once

  //const [attacks, setAttacks] = useState([
  const [attacks, setAttacks] = useState([
    generateAddition(),
    generateAddition(),
    generateAddition(),
    generateAddition(),
  ]);
  //const [opponentAttack, setOpponentAttack] = useState(generateAddition()); // State for the current addition attack
  const [opponentAttack, setOpponentAttack]  = useState(generateAddition()); // State for the current addition attack
  
  const handleNewAttacks = () => {
    // Generate four new Attacks
   setAttacks([
      generateAddition(),
      generateAddition(),
      generateAddition(),
      generateAddition(),
    ]);
    setOpponentAttack(generateAddition());
  };

  const currentOpponentAttack = opponentAttack.num1 + opponentAttack.num2;

  const [hp1, setHp1] = useState(0);
  const [hp2, setHp2] = useState(0);
  
  const handleAttackClick = (result:number) => {
    console.log("Attack:", result, "opponents Attack",currentOpponentAttack);
    const calculatedAttackResult = result - currentOpponentAttack;
      if (calculatedAttackResult<=0) {
        setHp2(Math.max(0, hp2 - currentOpponentAttack));
        setAttackAnim("animate-opAttack");
      } else {
        setHp1(Math.max(0, hp1 - result));
        setAttackAnim("animate-attack");
        
      }
      handleNewAttacks();
      setTimeout(() => setAttackAnim(""), 300); // Adjust time to match animation duration
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
       // Extract and set base_stat for HP
        if (data1?.stats?.[0]?.base_stat) {
          setHp1(data1.stats[0].base_stat*10);
        }
        if (data2?.stats?.[0]?.base_stat) {
          setHp2(data2.stats[0].base_stat*10);
        }
    };

    fetchPokemons();
  }, [pokemonIds]); // Re-run effect when IDs change

  // Function to handle button click and change both Pokémon IDs
  const handleChangePokemons = () => {
    const nextId1 = Math.floor(Math.random() * 1025) + 1;
    const nextId2 = Math.floor(Math.random() * 1025) + 1;
    setPokemonIds([nextId1, nextId2]); // Update IDs to trigger the useEffect
    handleNewAttacks();
  };

  

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full bg-blue-100">
        {loading ? (
          <h1 className="text-4xl font-bold text-blue-600">Loading...</h1>
        ) : (
          <div className="w-3/4">
            <div>
              <button
                onClick={handleChangePokemons}
                className="mt-4 p-2 bg-blue-500 text-white rounded w-full mb-8"
              >
                Try a different pokemon...
              </button>
            </div>
       
            {[pokemon1, pokemon2].map((pokemon, index) => (
              <div key={index} className={`mb-8 flex flex-col md:flex-row ${index === 1 ? 'md:flex-row-reverse' : ''} `}>
                {index==1 ? 
                 <div className=" flex-1 "></div> : ""
                }
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
                  <h2 className="text-1xl font-bold text-green-500">
                     <div
                      className="bg-green-500 h-full rounded-md text-white p-1 text-sm"
                      style={{ width: `${index===1 ? hp2/10 : hp1/10 }%` }}
                    >{index===1 ? hp2 : hp1 }</div>
                    
                  </h2>
                </div>
                <div className=" rounded w-40 h-40 flex justify-center items-center  flex-1 ml-auto mr-auto md:ml-0 md:mr-0">
                  <img
                    src={
                      index==1 ? pokemon.sprites.other["showdown"].back_default : pokemon.sprites.other["showdown"].front_default ||
                      pokemon.sprites.front_default
                    }
                    alt={pokemon.name}
                    className={`w-36 justify-center max-h-36 object-contain ${hp1==0 && index==0 ? 'grayscale' : hp2==0 && index==1 ? 'grayscale' : ''} 
                    ${index == 1 && attackAnim === "animate-attack" ? "animate-attack" : ""} 
                    ${index == 0 && attackAnim === "animate-opAttack" ? "animate-opAttack" : ""}   `}
                  />
                </div>  
                  {index==0 ? 
                 <div className=" flex-1 pt-4 bg-red-400 text-white text-center h-full p-2">
                    ATTACK{" "}
                    {pokemon1?.moves?.[0]?.move?.name
                      ? pokemon1.moves[0].move.name.toUpperCase()
                      : "No Move"}{" "}
                    <div className="grid grid-cols-2 gap-4 text-right ">
                      <div className="p-2 pl-28 pr-2">
                        <div className="">
                          <span>{opponentAttack.num1}</span>
                          <span className="ml-1">+</span>
                        </div>
                        <div className="">
                          <span>{opponentAttack.num2}</span>
                          <span className="ml-1">=</span>
                        </div>
                      </div>
                    </div>
                 </div>
                   : ""}
              </div>
            ))}
          </div>
        )}
        <div className="w-full h-full bg-poke-grey text-white flex flex-col md:flex-row items-center justify-center">
          <div className="flex-[1] p-6">
            {pokemon2 ? `What will ${pokemon2.name.toUpperCase()} do?` : "Loading Pokémon..."}
          </div>
          <div className="m-6 bg-white text-black rounded p-0 text-2xl flex-[3]">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {attacks.map((attack, index) => (
                //<li className="p-2 m-1 pl-8 pr-12 text-right bg-red-400 text-white" key={index} onClick={() => handleAttackClick(attack.result)}>
                <li className={`p-2 m-1 pl-2 pr-12   ${activeIndex === index ? "bg-red-800" : "bg-red-400"} text-white flex flex-row items-center`} key={index} onClick={() => setActiveIndex(index)}> 

                  <div className="text-sm md:text-lg  flex-[2] ">
                    {pokemon2?.moves?.[index]?.move?.name
                      ? pokemon2.moves[index].move.name.toUpperCase()
                      : "No Move"}
                  </div>
                  <div className="inline-block flex-[1] mr-4 text-right">
                    <div className="">
                      <span>{attack.num1}</span>
                      <span className="ml-1">+</span>
                    </div>
                    <div className="flex justify-end">
                      <span>{attack.num2}</span>
                      <span className="ml-1">=</span>
                    </div>
                  </div>
                  <div className=" inline-block flex-[1] ">
                  <input
                    type="number"
                   
                    onChange={(e) => {
                      const value = Number(e.target.value); // Convert input value to a number
                      if (value === attack.result) { // Strict equality check
                        handleAttackClick(attack.result); // Run the function
                      }
                    }} // Update state
                    placeholder="0"
                    className={`border p-1 m-2 rounded w-full text-gameboy-dgrey ${activeIndex === index ? "visible" : "invisible"  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ` }
                  />
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
