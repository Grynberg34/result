const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Avaliação = require('./Avaliação');

const Gabarito = connection.define('Gabarito', {
    id: { 
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true   
    },
    numero_pergunta: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resposta: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
},{
  tableName: 'gabaritos'
});

Gabarito.belongsTo(Avaliação, {foreignKey: 'avaliaçãoId', onUpdate: 'cascade', onDelete: 'cascade'});

module.exports = Gabarito;
