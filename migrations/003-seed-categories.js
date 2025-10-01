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
      }
      
    ];
    await queryInterface.bulkInsert('categories', categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};