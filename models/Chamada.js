const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Aluno = require('./Aluno');
const Aula = require('./Aula');

const Chamada = connection.define('Chamada', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  presença: { 
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },

},{
  tableName: 'chamadas'
});

Chamada.belongsTo(Aula, {foreignKey: 'aulaId', onUpdate: 'cascade', onDelete: 'cascade'});
Chamada.belongsTo(Aluno, {foreignKey: 'alunoId', onUpdate: 'cascade', onDelete: 'cascade'});


module.exports = Chamada;
