const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Semestre = require('./Semestre');

const Aula = connection.define('Aula', {
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
},{
  tableName: 'aulas'
});

Aula.belongsTo(Semestre, {foreignKey: 'semestreId', onUpdate: 'cascade', onDelete: 'cascade'});

module.exports = Aula;
