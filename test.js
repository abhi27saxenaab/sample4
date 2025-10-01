const { application } = require("express");

=========================


viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
},

router.put('/:slug/viewed', incrementViewCount);

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

npx sequelize-cli db:migrate


===============================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  // Remove tableName since migrations handle table creation
});
module.exports = Category;






call API



  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Use useEffect to perform the API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/:slug/viewed'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result); // Set the fetched data in state
      } catch (err) {
        setError(err); // Handle errors
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };
    fetchData(); // Call the async function
    // Optional: Cleanup function if needed (e.g., to cancel pending requests)
    return () => {
      // Cleanup logic here
    };
  }, []);

===========================================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  // Remove tableName since migrations handle table creation
});
module.exports = Category;



//seed data


Article.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

Category.hasMany(Article, {
  foreignKey: 'categoryId',
  as: 'articles'
});



===================















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