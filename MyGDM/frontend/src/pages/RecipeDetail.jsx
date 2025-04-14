import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeById } from '../services/recipeApi';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError('Failed to load recipe details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <div>Loading recipe...</div>;
  if (error) return <div>{error}</div>;
  if (!recipe) return <div>Recipe not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <Link to="/recipes" className="text-blue-500 underline mb-4 inline-block">← Back to Recipes</Link>
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      {recipe.description && <p className="mb-4">{recipe.description}</p>}
      <div className="mb-4">
        <span className="mr-2 font-semibold">Category:</span>{' '}
        <span>{recipe.category}</span>
      </div>
      <div className="mb-4">
        <span className="mr-2 font-semibold">Prep Time:</span>{' '}
        {recipe.prep_time_minutes} minutes |{' '}
        <span className="font-semibold">Cook Time:</span> {recipe.cook_time_minutes} minutes
      </div>
      <div className="mb-4">
        <span className="mr-2 font-semibold">Servings:</span> {recipe.servings}
      </div>
      <div className="mb-4">
        <span className="mr-2 font-semibold">Tags:</span> {recipe.tags.join(", ")}
      </div>
      <h2 className="text-2xl font-bold mb-2">Ingredients</h2>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold mb-2">Instructions</h2>
      <ol className="list-decimal list-inside">
        {recipe.instructions.map((step, index) => (
          <li key={index} className="mb-1">{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeDetail;
