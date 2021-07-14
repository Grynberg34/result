'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('code', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      codigo: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
    },{
      tableName: 'code'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('code');
  }
};
