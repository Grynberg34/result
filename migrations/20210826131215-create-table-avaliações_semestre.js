'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('avaliações_semestre', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      numero: { 
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pontos_pergunta: { 
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pontos_total: { 
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      disponivel: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      corrigido: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      semestreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'semestres'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      avaliaçãoId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'avaliações'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
  },{
    tableName: 'avaliações_semestre'
  }
  )},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('avaliações_semestre');
  }
};
