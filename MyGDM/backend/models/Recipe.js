const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "Lunch/Dinner" },
    prep_time_minutes: { type: Number, default: 0 },
    cook_time_minutes: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    ingredients: [String],
    instructions: [String],
    tags: { type: [String], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
