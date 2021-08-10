'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('semestres', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      data: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      nivel: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      professorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: 'professores'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      turmaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'turmas'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      concluido: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    }, 
    {
      tableName: 'semestres'
    }
  )},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('semestres');
  }
};
