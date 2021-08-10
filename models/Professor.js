const connection = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./User');

const Professor = connection.define('Professor', {
    id: { 
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true   
    },
},{
  tableName: 'professores'
});

Professor.belongsTo(User, {foreignKey: 'userId', onUpdate: 'cascade', onDelete: 'CASCADE'});

module.exports = Professor;
