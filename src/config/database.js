require('dotenv/config');

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
