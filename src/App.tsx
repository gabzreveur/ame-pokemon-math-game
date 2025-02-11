import { useEffect, useState, useRef } from "react";
import { getPokemon } from "./utils/api"; // Import the API function
import Layout from './Layout';
import { generateAddition } from "./utils/generateAddition";

function App() {
  const [pokemon1, setPokemon1] = useState<any>(null); // State for first Pokémon
  const [pokemon2, setPokemon2] = useState<any>(null); // State for second Pokémon
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [pokemonIds, setPokemonIds] = useState<[number, number]>([58, 155]); // State to store Pokémon IDs
  const [attackAnim, setAttackAnim] = useState<any>(null);
  const inputRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState<any>(null); // State to track active <li>
  const [selectedAttack, setSelectedAttack] = useState<any>(null); // State for selected attack

//addition inputs
  const [thousands, setThousands] = useState("");
  const [tens, setTens] = useState("");
  const [units, setUnits] = useState("");

  
  const thousandsRef = useRef<HTMLInputElement>(null);
  const tensRef = useRef<HTMLInputElement>(null);
  const unitsRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleChange = (value: string, type: string) => {
    if (type === "thousands") setThousands(value);
    if (type === "tens") setTens(value);
    if (type === "units") setUnits(value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, type: string) => {
    if (/^\d$/.test(event.key)) {
      setTimeout(() => {
        if (type === "tens") thousandsRef.current?.focus();
        if (type === "units") tensRef.current?.focus();
      }, 0); // Wait for the input value to update
    }
  };


//focus after selectedAttack
  useEffect(() => { 
    if (selectedAttack && unitsRef.current) {
      unitsRef.current.focus();
    }
  }, [selectedAttack]);

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
      setThousands(""); // Reset thousands input
      setTens(""); // Reset tens input
      setUnits(""); // Reset units input
      setSelectedAttack(null);
    
   };

   const [knockedOutImages, setKnockedOutImages] = useState([]); // Store last 3 KO images

   // Detect if pokemon was beaten
   useEffect(() => {
    if (hp1 <= 0 || hp2 <= 0) {

        if(pokemon1){
        // Store knocked-out Pokémon's image
        const knockedOutPokemon = hp1 <= 0 ? pokemon1 : pokemon2;
        const knockedOutImage = knockedOutPokemon.sprites.front_default;
        

        setKnockedOutImages((prev) => {
          const updatedImages = [...prev, knockedOutImage].slice(-3); // Keep only last 3
          return updatedImages;
        });
        hp2<=0 ? setKnockedOutImages([]) : "";


      }
   

      handleChangePokemons();
    }
  }, [hp1, hp2]);


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
    const nextId1 = Math.floor(Math.random() * 925) + 1; //there are 1025 but not all of them has all images
    const nextId2 = Math.floor(Math.random() * 925) + 1;
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
                className="mt-4 p-2 bg-blue-500 text-white rounded w-full mb-4"
              >
                Try a different pokemon...
              </button>
            </div>
       
            {[pokemon1, pokemon2].map((pokemon, index) => (
              <div key={index} className={`mb-8 flex flex-col md:flex-row ${index === 1 ? 'flex-col-reverse md:flex-row-reverse' : ''} `}>
                 {index === 1 ? (
                  <div className="flex-1">
                    {selectedAttack ? (
                     <div className=" flex-1 pt-4 bg-red-400 text-white text-center h-full p-2">
                    
                        <p className="">Selected Attack </p><h3 className="text-lg font-bold">
                        
                          {pokemon2?.moves?.[activeIndex]?.move?.name
                            ? pokemon2.moves[activeIndex].move.name.toUpperCase()
                            : "No Move"}
                        </h3>
                  
                       

                        <div className="grid grid-cols-4 gap-2 text-center items-center justify-items-center w-2/3 mx-auto ">
                          {/* First row (numbers) */}
                          <span className="ml-1"> </span>
                          {selectedAttack.num1.toString().split("").length < 2 ? (<span> </span>) : null}
                          {selectedAttack.num1.toString().split("").map((digit, index) => (
                            <span key={index} className="mx-1">{digit}</span>
                          ))}
                          <span className="ml-1">+</span>

                          <span className="ml-1"> </span>
                          {selectedAttack.num2.toString().split("").length < 2 ? (<span> </span>) : null}
                          {selectedAttack.num2.toString().split("").map((digit, index) => (
                            <span key={index} className="mx-1">{digit}</span>
                          ))}
                          <span className="ml-1">=</span>

                          {/* Second row (inputs) */}
                          <input
                            ref={thousandsRef}
                            type="number"
                            value={thousands}
                            onChange={(e) => {
                              const newThousands = e.target.value; // Get the new input value
                              const newValue = Number(`${newThousands}${tens}${units}`); // Combine latest input values

                              const lastDigit = newThousands.slice(-1); 
                              // Only allow 1 digit numbers
                              if (lastDigit.length <= 1 && !isNaN(lastDigit)) {
                                handleChange(lastDigit, "thousands");
                              }

                              if (newValue === selectedAttack.result) { 
                                handleAttackClick(selectedAttack.result); // Run the function
                              }
                                      }}
                            className="w-6 text-center text-gameboy-dgrey border m-1 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
                            placeholder="-"
                          />
                          <input
                            ref={tensRef}
                            type="number"
                            value={tens}
                            onChange={(e) =>  {
                              const value = e.target.value;
                              const lastDigit = value.slice(-1); 
                              // Only allow 1 digit numbers
                              if (lastDigit.length <= 1 && !isNaN(lastDigit)) {
                                handleChange(lastDigit, "tens");
                              }
                            }}
                            onKeyDown={(e) => handleKeyPress(e, "tens")}
                            className="w-6 text-center text-gameboy-dgrey border m-1 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
                            placeholder="-"
                          />
                          <input
                            ref={unitsRef}
                            type="number"
                            value={units}
                            onChange={(e) => {
                              const value = e.target.value;
                              const lastDigit = value.slice(-1); 
                              // Only allow 1 digit numbers
                              if (lastDigit.length <= 1 && !isNaN(lastDigit)) {
                                handleChange(lastDigit, "units");
                              }
                            }}
                            onKeyDown={(e) => handleKeyPress(e, "units")}
                            className="w-6 text-center text-gameboy-dgrey border m-1 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none "
                            placeholder="-"
                          />

                      </div>
                 
                            


        
          {/*
                        <input
                          type="number"
                          ref={inputRef} // Attach ref here
                          onChange={(e) => {
                            const value = Number(e.target.value); // Convert input value to a number
                            if (value === selectedAttack.result) { // Strict equality check
                              handleAttackClick(selectedAttack.result); // Run the function
                            }
                          }} // Update state
                          placeholder="0"
                          className={`border p-1 m-2 rounded w-1/2 text-gameboy-dgrey [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ` }
                        />

          */}
                      </div>

                    ) : (
                      <div className="flex flex-col justify-end items-center h-full text-red-400">
                        <h2 className="text-4xl text-center">
                          Select an attack!
                        </h2>
                        <div className="flex justify-center mt-2">
                         <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-400"></div>
                        </div>
                      </div>


                    )}
                  </div>
                ) : (
                  ""
                )}
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
                      style={{ width: `${index===1 ? hp2/15 : hp1/15 }%` }}
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
                 <div className=" flex-1 pt-2 pb-2 bg-red-400 text-white text-center h-full flex flex-col items-center justify-center ">
                    <p className="">Attack - {" "} 
                    {pokemon1?.moves?.[0]?.move?.name
                      ? pokemon1.moves[0].move.name.toUpperCase()
                      : "No Move"}{" "}</p>
                      <h3 className="text-2xl">{opponentAttack.num1}+{opponentAttack.num2}=<span className="font-bold">{opponentAttack.result}</span></h3>
                 </div>
                   : ""}
              </div>
            ))}
          </div>
        )}
        <div className="w-full h-full bg-poke-grey text-white flex flex-col md:flex-row items-center justify-center">
          <div className="flex-[1] p-6">
            {pokemon2 ? `What will ${pokemon2.name.toUpperCase()} do?` : "Loading Pokémon..."}
                <p>Last Knocked-Out Pokémon</p>
                <div className="flex">
                  {knockedOutImages.map((img, index) => (
                    
                    <img key={index} src={img} alt="Knocked-Out Pokémon" style={{ width: 80, height: 80 }} />
                    
                ))}
                </div>
          </div>
          <div className="m-6 bg-white text-black rounded p-0 text-2xl flex-[3]">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {attacks.map((attack, aindex) => (
                //<li className="p-2 m-1 pl-8 pr-12 text-right bg-red-400 text-white" key={index} onClick={() => handleAttackClick(attack.result)}>
                <li className={`p-2 m-1 pl-2 pr-12   ${activeIndex === aindex ? "bg-red-800" : "bg-red-400"} text-white flex flex-row items-center`} key={aindex} 
                onClick={() => {
                  setActiveIndex(aindex);
                  setSelectedAttack(attack);
                  
                  setThousands(""); // Reset thousands input
                  setTens(""); // Reset tens input
                  setUnits(""); // Reset units input
                  // Focus the input field
                  if (unitsRef.current) {
                    unitsRef.current.focus();
                  }
                  
                }}> 

                  <div className="text-sm md:text-lg  flex-[2] ">
                    {pokemon2?.moves?.[aindex]?.move?.name
                      ? pokemon2.moves[aindex].move.name.toUpperCase()
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
                 {/*
                  <input
                    type="number"
                   
                    onChange={(e) => {
                      const value = Number(e.target.value); // Convert input value to a number
                      if (value === attack.result) { // Strict equality check
                        handleAttackClick(attack.result); // Run the function
                      }
                    }} // Update state
                    placeholder="0"
                    className={`border p-1 m-2 rounded w-full text-gameboy-dgrey ${activeIndex === aindex ? "visible" : "invisible"  } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ` }
                  />
                  */}
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
