'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    queryInterface.removeColumn('materiais', 'link'
  )},

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

