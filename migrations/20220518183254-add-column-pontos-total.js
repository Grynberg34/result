'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    queryInterface.addColumn('avaliações_semestre', 'pontos_total', {
      type: DataTypes.INTEGER,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('avaliações_semestre', 'pontos_total');
  }
};

