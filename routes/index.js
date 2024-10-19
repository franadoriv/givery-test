const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');;
const router = express.Router();
const { Recipe } = require('../models');

router.use(bodyParser.json());

// Serve the index.html file for the root route
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// POST /recipes - Create a new recipe
router.post('/recipes', async (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;

  if (!title || !making_time || !serves || !ingredients || !cost) {
    return res.status(400).json({ 
      message: "Recipe creation failed!", 
      required: "title, making_time, serves, ingredients, cost" 
    });
  }

  try {
    const recipe = await Recipe.create({
      title, making_time, serves, ingredients, cost,
    });

    res.status(200).json({
      message: "Recipe successfully created!",
      recipe,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating recipe" });
  }
});

// GET /recipes - Retrieve all recipes
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving recipes" });
  }
});

// GET /recipes/:id - Retrieve a recipe by ID
router.get('/recipes/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ recipe });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving recipe" });
  }
});

// PATCH /recipes/:id - Update a recipe by ID
router.patch('/recipes/:id', async (req, res) => {
  const id = req.params.id;
  const { title, making_time, serves, ingredients, cost } = req.body;

  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await recipe.update({
      title: title || recipe.title,
      making_time: making_time || recipe.making_time,
      serves: serves || recipe.serves,
      ingredients: ingredients || recipe.ingredients,
      cost: cost || recipe.cost,
    });

    res.status(200).json({ message: "Recipe successfully updated!", recipe });
  } catch (err) {
    res.status(500).json({ message: "Error updating recipe" });
  }
});

// DELETE /recipes/:id - Delete a recipe by ID
router.delete('/recipes/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await recipe.destroy();
    res.status(200).json({ message: "Recipe successfully deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting recipe" });
  }
});

module.exports = router;
