const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const Material = connection.define('Material', {
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
    },
    nivel: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
    },
    coleção: {
      type: DataTypes.STRING,
      allowNull: true,
    },
},{
  tableName: 'materiais'
});

module.exports = Material;
