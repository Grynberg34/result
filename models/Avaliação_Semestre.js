const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Semestre = require('./Semestre');
const Avaliação = require('./Avaliação');

const Avaliação_Semestre = connection.define('Avaliação_Semestre', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
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
},{
  tableName: 'avaliações_semestre'
});

Avaliação_Semestre.belongsTo(Semestre, {foreignKey: 'semestreId', onUpdate: 'cascade', onDelete: 'cascade'});

Avaliação_Semestre.belongsTo(Avaliação, {foreignKey: 'avaliaçãoId', onUpdate: 'cascade', onDelete: 'set null'});

module.exports = Avaliação_Semestre;
