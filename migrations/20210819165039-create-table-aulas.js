'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('aulas', {
      id: { 
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true   
      },
      numero_aula: { 
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      tema: { 
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      comentarios: { 
        type: DataTypes.STRING(50000),
        allowNull: true,
      },
      chamada: { 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
  },{
    tableName: 'aulas'
  }
  )},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('aulas');
  }
};
