'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('turmas', {
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
      }
    }, 
    {
      tableName: 'turmas'
    }
  )},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('turmas');
  }
};
