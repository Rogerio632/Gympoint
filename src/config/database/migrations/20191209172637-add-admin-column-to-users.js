module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'isAdmin', {
      type: Sequelize.BOOLEAN,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
      default: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'isAdmin');
  },
};
