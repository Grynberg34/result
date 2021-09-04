const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Avaliação_Semestre = require('./Avaliação_Semestre');
const Aluno = require('./Aluno');

const Avaliação_Nota = connection.define('Avaliação_Nota', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  nota: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

},{
  tableName: 'avaliações_notas'
});

Avaliação_Nota.belongsTo(Avaliação_Semestre, {foreignKey: 'avaliação_semestreId', onUpdate: 'cascade', onDelete: 'cascade'});
Avaliação_Nota.belongsTo(Aluno, {foreignKey: 'alunoId', onUpdate: 'cascade', onDelete: 'cascade'});

module.exports = Avaliação_Nota;
