'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    queryInterface.addColumn('materiais', 'coleção', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('materiais', 'coleção');
  }
};
