const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'resultenglish.mysql.uhserver.com',
  user     : 'adminf4',   
  password : 'english2021@',
  database : 'resultenglish'
})

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

setInterval(function () {
  connection.query('SELECT 1');
}, 5000);

module.exports = connection;