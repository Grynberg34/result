'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('materiais', {
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
      link: { 
        type: DataTypes.STRING,
      }
  },{
    tableName: 'materiais'
  }
  )},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('materiais');
  }
};
