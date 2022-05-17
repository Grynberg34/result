const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const Avaliação = connection.define('Avaliação', {
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
    tipo: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    coleção: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    gabarito: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
},{
  tableName: 'avaliações'
});

module.exports = Avaliação;
