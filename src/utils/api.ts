import axios from 'axios';

export const getPokemon = async (id: number) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    return null;
  }
};
