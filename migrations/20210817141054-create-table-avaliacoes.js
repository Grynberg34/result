'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('avaliações', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      nome: { 
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      nivel: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      numero_perguntas: { 
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      texto: { 
        type: DataTypes.STRING(50000),
        allowNull: false,
      },
  },{
    tableName: 'avaliações'
  }
  )},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('avaliações');
  }
};
