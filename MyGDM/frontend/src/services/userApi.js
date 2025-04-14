import axios from "axios";

const BASE_URL = "http://localhost:5000/api/users";
const getToken = () => localStorage.getItem('token');

export const addFavoriteRecipe = async (recipeId) => {
  const token = getToken();
  const res = await axios.post(
    `${BASE_URL}/favorites`,
    { recipeId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const removeFavoriteRecipe = async (recipeId) => {
  const token = getToken();
  const res = await axios.delete(
    `${BASE_URL}/favorites/${recipeId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getFavoriteRecipes = async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/favorites`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
