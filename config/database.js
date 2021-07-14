const { Sequelize } = require('sequelize');

var connection = new Sequelize('resultenglish', 'adminf4', 'english2020@', {

  host: 'resultenglish.mysql.uhserver.com',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
})

connection.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

module.exports = connection;