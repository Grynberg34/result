'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    queryInterface.addColumn('avaliações', 'gabarito', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('avaliações', 'gabarito');
  }
};
