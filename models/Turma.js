const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const Turma = connection.define('Turma', {
    id: { 
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true   
    },
    nome: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    }
},{
  tableName: 'turmas'
});

module.exports = Turma;
