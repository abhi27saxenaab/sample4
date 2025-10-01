const { Category, sequelize } = require('../models');

const seedCategories = async () => {
  try {
    const categories = [
      { name: 'Travel', description: 'Articles about travel destinations and experiences' },
      { name: 'Animals', description: 'Articles about wildlife and pets' }
    ];

    for (const categoryData of categories) {
      await Category.findOrCreate({
        where: { name: categoryData.name },
        defaults: categoryData
      });
    }

    console.log('Categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedCategories().then(() => {
    console.log('Seeding completed');
    process.exit(0);
  });
}
module.exports = seedCategories;