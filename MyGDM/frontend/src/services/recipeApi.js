import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/recipes';

export const fetchAllRecipes = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getRecipeById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// You can add more functions as needed (e.g., createRecipe, updateRecipe, deleteRecipe)
