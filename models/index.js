const { sequelize } = require('../config/database');
const Article = require('./article');
const Category = require('./category');
const Category1 = require('./category1');

// Define associations
Article.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

Category.hasMany(Article, {
  foreignKey: 'categoryId',
  as: 'articles'
});

module.exports = {
  sequelize,
  Article,
  Category,
  Category1
};