const { Article, Category, sequelize } = require('../models');
const { Op } = require('sequelize');



// Tier 1: Increment view count
const incrementViewCount = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const article = await Article.findOne({ where: { slug } });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Increment view count
    article.viewCount += 1;
    await article.save();
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Get article by slug (with viewCount)
const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const article = await Article.findOne({
      where: { slug },
      include: [{
        model: Category,
        as: 'category', // Use the alias
        attributes: ['id', 'name', 'description']
      }]
    });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create article
const createArticle = async (req, res) => {
  try {
    const { title, content, author, tags, categoryId } = req.body;
    
    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const article = await Article.create({
      title,
      slug,
      content,
      author,
      tags: Array.isArray(tags) ? tags.join(',') : tags,
      categoryId,
      viewCount: 0
    });
    
    // const articleWithCategory = await Article.findByPk(article.id, {
    //   include: [{
    //     model: Category,
    //     as: 'category', // Use the alias
    //     attributes: ['id', 'name', 'description']
    //   }]
    // });
    
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, tags, categoryId } = req.body;
    
    const article = await Article.findByPk(id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Update fields
    if (title) article.title = title;
    if (content) article.content = content;
    if (author) article.author = author;
    if (tags) article.tags = Array.isArray(tags) ? tags.join(',') : tags;
    if (categoryId) article.categoryId = categoryId;
    
    await article.save();
    
    const updatedArticle = await Article.findByPk(id, {
      include: [{
        model: Category,
        as: 'category', // Use the alias
        attributes: ['id', 'name', 'description']
      }]
    });
    
    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






// Tier 4: Get recommended articles
const getRecommendedArticles = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const currentArticle = await Article.findOne({
      where: { slug },
      include: [{
        model: Category,
        as: 'category' // Use the alias
      }]
    });
    
    if (!currentArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    let recommendedArticles = [];
    
    // Strategy 1: Articles in the same category
    if (currentArticle.categoryId) {
      const sameCategoryArticles = await Article.findAll({
        where: {
          categoryId: currentArticle.categoryId,
          id: { [Op.ne]: currentArticle.id }
        },
        include: [{
          model: Category,
          as: 'category', // Use the alias
          attributes: ['id', 'name']
        }],
        order: [['viewCount', 'DESC']],
        limit: 5
      });
      
      recommendedArticles = recommendedArticles.concat(sameCategoryArticles.map(article => article.toJSON()));
    }
    
    // Strategy 2: Articles sharing tags
    if (currentArticle.tags) {
      const currentTags = currentArticle.tags.split(',').map(tag => tag.trim());
      
      const allArticles = await Article.findAll({
        where: {
          id: { [Op.ne]: currentArticle.id }
        },
        include: [{
          model: Category,
          as: 'category', // Use the alias
          attributes: ['id', 'name']
        }]
      });
      
      const articlesWithSharedTags = allArticles.filter(article => {
        if (!article.tags) return false;
        
        const articleTags = article.tags.split(',').map(tag => tag.trim());
        const sharedTags = currentTags.filter(tag => articleTags.includes(tag));
        
        return sharedTags.length > 0;
      });
      
      // Sort by number of shared tags and view count
      articlesWithSharedTags.sort((a, b) => {
        const aTags = a.tags.split(',').map(tag => tag.trim());
        const bTags = b.tags.split(',').map(tag => tag.trim());
        
        const aSharedCount = currentTags.filter(tag => aTags.includes(tag)).length;
        const bSharedCount = currentTags.filter(tag => bTags.includes(tag)).length;
        
        if (bSharedCount !== aSharedCount) {
          return bSharedCount - aSharedCount;
        }
        
        return b.viewCount - a.viewCount;
      });
      
      recommendedArticles = recommendedArticles.concat(articlesWithSharedTags.slice(0, 5).map(article => article.toJSON()));
    }
    
    // Remove duplicates and limit to 5 articles
    const uniqueArticles = [];
    const seenIds = new Set();
    
    for (const article of recommendedArticles) {
      if (!seenIds.has(article.id) && article.id !== currentArticle.id) {
        seenIds.add(article.id);
        uniqueArticles.push(article);
      }
      
      if (uniqueArticles.length >= 5) break;
    }
    
    // If we still don't have enough recommendations, add most viewed articles
    if (uniqueArticles.length < 5) {
      const mostViewedArticles = await Article.findAll({
        where: {
          id: { 
            [Op.notIn]: [...seenIds, currentArticle.id]
          }
        },
        include: [{
          model: Category,
          as: 'category', // Use the alias
          attributes: ['id', 'name']
        }],
        order: [['viewCount', 'DESC']],
        limit: 5 - uniqueArticles.length
      });
      
      uniqueArticles.push(...mostViewedArticles.map(article => article.toJSON()));
    }
    
    res.json(uniqueArticles.slice(0, 5));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  incrementViewCount,
  getArticleBySlug,
  createArticle,
  updateArticle,
  getRecommendedArticles,
  getAllArticles
};