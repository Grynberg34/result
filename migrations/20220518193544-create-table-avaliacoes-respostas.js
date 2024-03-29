'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('avaliações_respostas', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      resposta: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
      },
      avaliação_semestreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'avaliações_semestre'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      alunoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'alunos'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
  },{
    tableName: 'avaliações_respostas'
  }
  )},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('avaliações_respostas');
  }
};