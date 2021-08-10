const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Professor = require('./Professor');
const Turma = require('./Turma');

const Semestre = connection.define('Semestre', {
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
    concluido: { 
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
},{
  tableName: 'semestres'
});

Semestre.belongsTo(Turma, {foreignKey: 'turmaId', onUpdate: 'cascade', onDelete: 'CASCADE'});
Semestre.belongsTo(Professor, {foreignKey: 'professorId', onUpdate: 'cascade', onDelete: 'CASCADE'});


module.exports = Semestre;
