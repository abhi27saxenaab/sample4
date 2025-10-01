const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory
} = require('../controllers/categoryController');

// Get all categories
router.get('/', getAllCategories);

// Create category
router.post('/', createCategory);

module.exports = router;