const connection = require('../config/database');
const { DataTypes } = require('sequelize');

const User = connection.define('User', {
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
    email: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    telefone: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    data_nascimento: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo_conta: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'aluno'
    },
    token_redefinir: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
},{
  tableName: 'users'
});

module.exports = User;
