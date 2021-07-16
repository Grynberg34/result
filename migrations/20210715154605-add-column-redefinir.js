'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    queryInterface.addColumn('users', 'token_redefinir', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
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
