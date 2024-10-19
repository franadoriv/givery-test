const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env["MYSQL_PUBLIC_URL"]);

// Define the Recipe model
const Recipe = sequelize.define('recipe', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  },
  making_time: {
    type: DataTypes.STRING(100),
    allowNull: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  },
  serves: {
    type: DataTypes.STRING(100),
    allowNull: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  },
  ingredients: {
    type: DataTypes.STRING(300),
    allowNull: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  },
  cost: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  timestamps: false,  // Disabling automatic Sequelize timestamps
});

(async () => {
  try {
    // Sync the model with the database
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully.");
  } catch (error) {
    console.error("Error syncing database: ", error);
  }
})();

(async () => {
  try {
    // Sync the model with the database
    await sequelize.sync({ alter: true });

    // Check if data exists and insert if empty
    const recipeCount = await Recipe.count();
    console.log("Recipe count: ", recipeCount);
    if (recipeCount === 0) {
      await Recipe.bulkCreate([
        {
          id: 1,
          title: 'Chicken Curry',
          making_time: '45 min',
          serves: '4 people',
          ingredients: 'onion, chicken, seasoning',
          cost: 1000,
          created_at: '2016-01-10 12:10:12',
          updated_at: '2016-01-10 12:10:12',
        },
        {
          id: 2,
          title: 'Rice Omelette',
          making_time: '30 min',
          serves: '2 people',
          ingredients: 'onion, egg, seasoning, soy sauce',
          cost: 700,
          created_at: '2016-01-11 13:10:12',
          updated_at: '2016-01-11 13:10:12',
        },
      ]);
      console.log("Initial recipes inserted.");
    }

    console.log("Database synced and seeded successfully.");
  } catch (error) {
    console.error("Error syncing and seeding database: ", error);
  }
})();

module.exports = { sequelize, Recipe };
