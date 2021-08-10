const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Turma = require('./Turma');

const Aluno = connection.define('Aluno', {
    id: { 
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true   
    }
},{
  tableName: 'alunos'
});

Aluno.belongsTo(Turma, {foreignKey: 'turmaId', onUpdate: 'cascade'});
Aluno.belongsTo(User, {foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = Aluno;
