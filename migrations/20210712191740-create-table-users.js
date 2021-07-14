'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
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
      email: { 
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false
      },
      tipo_conta: {
          type: DataTypes.STRING,
          allowNull: false,
          default: 'aluno'
      }
      }, 
      {
        tableName: 'users'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
