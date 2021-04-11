const mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'mysql743.umbler.com',
  port     :  '41890',
  user     : 'admin002',   
  password : 'english2021result',
  database : 'result'
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