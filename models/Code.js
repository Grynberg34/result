const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const Code = connection.define('Code', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  codigo: { 
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true   
  },
},{
  tableName: 'code'
});

module.exports = Code;
