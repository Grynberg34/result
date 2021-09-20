const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const Aula = require('./Aula');

const Link_Aula = connection.define('Link_Aula', {
  id: { 
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true   
  },
  nome: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: { 
    type: DataTypes.STRING,
    allowNull: false,
  },

},{
  tableName: 'links_aula'
});

Link_Aula.belongsTo(Aula, {foreignKey: 'aulaId', onUpdate: 'cascade', onDelete: 'cascade'});

module.exports = Link_Aula;