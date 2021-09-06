const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Avaliação_Semestre = require('./Avaliação_Semestre');
const Aluno = require('./Aluno');

const Avaliação_Resposta = connection.define('Avaliação_Resposta', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  numero_pergunta: {
    type: DataTypes.INTEGER
  },
  resposta: {
    type: DataTypes.STRING(50000),
    allowNull: true
  }
},{
  tableName: 'avaliações_respostas'
});

Avaliação_Resposta.belongsTo(Avaliação_Semestre, {foreignKey: 'avaliação_semestreId', onUpdate: 'cascade', onDelete: 'cascade'});
Avaliação_Resposta.belongsTo(Aluno, {foreignKey: 'alunoId', onUpdate: 'cascade', onDelete: 'cascade'});

module.exports = Avaliação_Resposta;
