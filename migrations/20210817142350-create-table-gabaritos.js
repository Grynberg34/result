'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('gabaritos', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      numero_pergunta: { 
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      resposta: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      avaliaçãoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'avaliações'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
  },{
    tableName: 'gabaritos'
  }
  )},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('gabaritos');
  }
};
