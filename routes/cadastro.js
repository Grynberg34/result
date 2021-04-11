const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db/connection');

function checkAuthentication(req,res,next){
  if (req.isAuthenticated()) {
    if(req.user.tipo_conta == 'user'){
      res.redirect('/user')
    }
  
    else if (req.user.tipo_conta == 'admin') {
      res.redirect('/admin')
    }
  }
  else{
    next()
  }
}

router.get('/', checkAuthentication, function(_, res) {
  res.render('cadastro')
});



router.post('/', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var tel = req.body.tel;
  var password = req.body.password;
  var repeat = req.body.repeatpassword;
  var userexists = "Esse email já foi utilizado por outro usuário";
  var passdontmatch = "As senhas não coincidem.";

  if (password == repeat) {
    var hashedpassword = bcrypt.hashSync(password, 10);
    var sql = `INSERT INTO users (nome, email, tel, tipo_conta, hashedpassword) VALUES ('${name}', '${email}', '${tel}', 'user', '${hashedpassword}')`;
    connection.query(sql, function (err) {
      if (err) res.render('cadastro', {userexists})
      else {
      res.redirect('login')}
    });
  } 
  else res.render('cadastro', {passdontmatch}) 


});

module.exports = router;
