const express = require('express');
const router = express.Router();
const {
  incrementViewCount,
  getArticleBySlug,
  createArticle,
  updateArticle,
  getRecommendedArticles,
  getAllArticles
} = require('../controllers/articleController');

// Tier 1: Increment view count
router.put('/:slug/viewed', incrementViewCount);

// Tier 4: Get recommended articles
router.get('/:slug/recommendations', getRecommendedArticles);

// Get article by slug
router.get('/:slug', getArticleBySlug);

// Get all articles
router.get('/', getAllArticles);

// Create article
router.post('/', createArticle);

// Update article
router.put('/:id', updateArticle);

module.exports = router;