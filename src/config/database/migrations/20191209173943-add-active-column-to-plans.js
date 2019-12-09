module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('plans', 'active', {
      type: Sequelize.BOOLEAN,
      default: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('column');
  },
};
