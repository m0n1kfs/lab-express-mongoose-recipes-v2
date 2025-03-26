const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const Recipe = require("./models/Recipe.model");

const app = express();
// MONGODB CONNECTION (Iteration 1)
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});

/* 
  Iteration 3 | Create a Recipe
  POST /recipes
  Creates a new recipe in the database.
  - Success: respond with status 201 + JSON of created recipe
  - Error: respond with status 500 + JSON error message
*/
app.post("/recipes", async (req, res) => {
  try {
    const newRecipe = await Recipe.create(req.body);
    return res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/* 
  Iteration 4 | Get All Recipes
  GET /recipes
  Fetch all recipe documents from the database.
  - Success: respond with status 200 + JSON array
  - Error: respond with status 500 + JSON error message
*/
app.get("/recipes", async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    return res.status(200).json(allRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/*
  Iteration 5 | Get a Single Recipe
  GET /recipes/:id
  Fetch a single recipe by its ID.
  - Success: respond with status 200 + JSON object
  - If not found, you may return 404 or a similar error
  - Error: respond with status 500 + JSON error message
*/
app.get("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/*
  Iteration 6 | Update a Single Recipe
  PUT /recipes/:id
  Update a recipe by its ID.
  - Success: respond with status 200 + JSON object
  - If not found, return 404 or similar
  - Error: respond with status 500 + JSON error message
*/
app.put("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, req.body, {
      new: true
    });
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/*
  Iteration 7 | Delete a Single Recipe
  DELETE /recipes/:id
  Remove a recipe from the database by its ID.
  - Success: respond with status 204 (No Content)
  - If not found, return 404 or similar
  - Error: respond with status 500 + JSON error message
*/
app.delete("/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// START THE SERVER
app.listen(3000, () => console.log("Server listening on port 3000!"));

// ❗️DO NOT REMOVE:
module.exports = app;