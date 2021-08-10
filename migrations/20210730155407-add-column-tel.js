'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    queryInterface.addColumn('users', 'telefone', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
