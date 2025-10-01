'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        name: 'Travel',
        description: 'Articles about travel destinations and experiences',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Animals',
        description: 'Articles about wildlife and pets',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Technology',
        description: 'Articles about latest tech trends and innovations',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Food',
        description: 'Articles about cooking, recipes, and culinary experiences',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sports',
        description: 'Articles about various sports and athletic events',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Health',
        description: 'Articles about health, wellness, and medical advice',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Science',
        description: 'Articles about scientific discoveries and research',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Business',
        description: 'Articles about business, finance, and entrepreneurship',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('categories', categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};