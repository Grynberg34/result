'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('links_aula', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      nome: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      aulaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'aulas'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
  },{
    tableName: 'links_aula'
  }
  )},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('links_aula');
  }
};
