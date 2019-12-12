module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Pedro Álvares Cabral',
          email: 'pedro@alvares.cabral',
          age: 500,
          weight: 100,
          height: 170,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
