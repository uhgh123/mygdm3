import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { fetchAllRecipes } from '../services/recipeApi';
import { addFavoriteRecipe, removeFavoriteRecipe, getFavoriteRecipes } from '../services/userApi';

const getToken = () => localStorage.getItem('token');

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedPrepTime, setSelectedPrepTime] = useState('');
  const [selectedCookTime, setSelectedCookTime] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Predefined filter options
  const dietOptions = [
    "Low Carb",
    "Vegetarian",
    "High Protein",
    "Gluten Free",
    "Dairy"
  ];

  const prepTimeOptions = [
    { label: 'Under 15 minutes', value: 'under-15' },
    { label: '15–30 minutes', value: '15-30' },
    { label: 'Over 30 minutes', value: 'over-30' }
  ];

  const cookTimeOptions = [
    { label: 'Under 15 minutes', value: 'cook-under-15' },
    { label: '15–30 minutes', value: 'cook-15-30' },
    { label: 'Over 30 minutes', value: 'cook-over-30' }
  ];

  const categoryOptions = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Drink"
  ];

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchAllRecipes();
        setRecipes(data);
      } catch (err) {
        console.error('Failed to load recipes:', err);
      }
    };
    loadRecipes();
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const loadFavorites = async () => {
        try {
          const favs = await getFavoriteRecipes();
          // Assuming the API returns an array of fully populated recipe objects
          setFavorites(favs.map(recipe => recipe._id));
        } catch (err) {
          console.error("Failed to load favorites:", err);
        }
      };
      loadFavorites();
    }
  }, []);

  // Filtering recipes, including the favorites toggle
  const filterRecipes = () => {
    return recipes.filter((r) => {
      const searchText = search.toLowerCase();
      const matchSearch =
        r.title.toLowerCase().includes(searchText) ||
        r.description.toLowerCase().includes(searchText) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(searchText));

      const matchCategory =
        !selectedCategory ||
        (r.category && r.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchDiet =
        !selectedDiet ||
        (r.tags && r.tags.some((t) => t.toLowerCase() === selectedDiet.toLowerCase()));

      const matchPrepTime = filterByTime(r.prep_time_minutes, selectedPrepTime);
      const matchCookTime = filterByTime(r.cook_time_minutes, selectedCookTime);

      // Only include the recipe if favorites filter is off or the recipe is in favorites
      const matchFavorites = !showFavoritesOnly || favorites.includes(r._id);

      return matchSearch && matchCategory && matchDiet && matchPrepTime && matchCookTime && matchFavorites;
    });
  };

  const filterByTime = (timeValue, selectedRange) => {
    if (!selectedRange) return true;
    const time = Number(timeValue);
    if (selectedRange === 'under-15' || selectedRange === 'cook-under-15') return time < 15;
    if (selectedRange === '15-30' || selectedRange === 'cook-15-30') return time >= 15 && time < 30;
    if (selectedRange === 'over-30' || selectedRange === 'cook-over-30') return time >= 30;
    return true;
  };

  const toggleFavorite = async (recipeId) => {
    try {
      if (!favorites.includes(recipeId)) {
        await addFavoriteRecipe(recipeId);
        setFavorites(prev => [...prev, recipeId]);
      } else {
        await removeFavoriteRecipe(recipeId);
        setFavorites(prev => prev.filter(id => id !== recipeId));
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const FavoriteIcon = ({ recipeId }) => {
    const isFav = favorites.includes(recipeId);
    return (
      <button
        onClick={(e) => { e.preventDefault(); toggleFavorite(recipeId); }}
        className="focus:outline-none"
      >
        {isFav ? (
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">🍽️ Recipes</h1>

        {/* Toggle Favorites Filter Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowFavoritesOnly(prev => !prev)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {showFavoritesOnly ? "Show All Recipes" : "Show Favorites Only"}
          </button>
        </div>

        {/* Search Field */}
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />

        {/* Filters Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categoryOptions.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Diet Filter */}
          <div>
            <label className="block text-sm font-semibold mb-1">Diet</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
            >
              <option value="">All Diets</option>
              {dietOptions.map((diet, idx) => (
                <option key={idx} value={diet}>{diet}</option>
              ))}
            </select>
          </div>

          {/* Prep Time Filter */}
          <div>
            <label className="block text-sm font-semibold mb-1">Prep Time</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={selectedPrepTime}
              onChange={(e) => setSelectedPrepTime(e.target.value)}
            >
              <option value="">All</option>
              {prepTimeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Cook Time Filter */}
          <div>
            <label className="block text-sm font-semibold mb-1">Cook Time</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={selectedCookTime}
              onChange={(e) => setSelectedCookTime(e.target.value)}
            >
              <option value="">All</option>
              {cookTimeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {filterRecipes().map((recipe) => (
            <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
              <div className="relative border rounded p-4 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg transition">
                {/* Favorite Icon */}
                <div className="absolute top-2 right-2">
                  <FavoriteIcon recipeId={recipe._id} />
                </div>
                <h2 className="text-lg font-semibold mb-1">{recipe.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{recipe.description}</p>
                {/* Display Prep and Cook Times */}
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Prep:</strong> {recipe.prep_time_minutes} min | <strong>Cook:</strong> {recipe.cook_time_minutes} min
                </p>
                <p className="font-semibold mb-1">Ingredients:</p>
                <ul className="list-disc pl-5 mb-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
                <p className="font-semibold mb-1">Instructions:</p>
                <ol className="list-decimal pl-5 mb-3">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RecipesPage;
