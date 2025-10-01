const { Category, sequelize } = require('../models');

const seedCategories = async () => {
  try {
    const categories = [
      { name: 'Travel', description: 'Articles about travel destinations and experiences' },
      { name: 'Animals', description: 'Articles about wildlife and pets' },
      { name: 'Technology', description: 'Articles about latest tech trends and innovations' },
      { name: 'Food', description: 'Articles about cooking, recipes, and culinary experiences' },
      { name: 'Sports', description: 'Articles about various sports and athletic events' },
      { name: 'Health', description: 'Articles about health, wellness, and medical advice' },
      { name: 'Science', description: 'Articles about scientific discoveries and research' },
      { name: 'Business', description: 'Articles about business, finance, and entrepreneurship' }
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