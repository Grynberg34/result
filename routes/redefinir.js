const express = require('express');
const router = express.Router();
const nodemailer = require ('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const connection = require('../db/connection')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  auth: {
    user: 'contemfolia.suporte@gmail.com',
    pass: 'mbzgysobnklsggjh'
  },
  tls: {
    rejectUnauthorized: false
  }
}));


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

router.get('/',checkAuthentication, function(_, res) {
  res.render('redefinir')
});

router.post('/', function(req, res) {

  var email = req.body.email;
  var emailnotfound = 'Não existe nenhuma conta com esse email.'
  
  connection.query(`SELECT * from users where EMAIL = '${email}' `, function(err, rows) {
    if (err)
      console.log(err)
    if (!rows.length) {
      res.render('redefinir', {emailnotfound})
    }
    else {
      var code = uuidv4();
      req.flash('code', code)
      req.flash('email', email )
      var mailOptions = {
        from: 'Folia - Suporte contemfolia.suporte@gmail.com',
        to: `${email}`,
        subject: 'Criar Nova Senha- Folia ',
        text: `Use este código para criar uma nova senha: ${code}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.redirect('/redefinir/codigo')
    }
  });
});

router.get('/codigo',checkAuthentication, function(_, res) {
  res.render('code')
});

router.post('/codigo', function(req, res) {
  var code = req.flash('code');
  var email = req.flash('email');
  var emailcode = req.body.code;
  var password = req.body.password;
  var repeat = req.body.repeatpassword;
  var message = 'Senhas não coincidem.';
  var message2 = 'Código errado. Tente novamente.';
  var hashedpassword = bcrypt.hashSync(password, 10);
  if (password == repeat){
    if (code == emailcode) {
      connection.query(`UPDATE users SET hashedpassword = '${hashedpassword}' WHERE email = '${email}'`);
      return res.render('success')
    } 
    else 
    console.log(code);
    return res.render('redefinir', {message2})
  } else return res.render('redefinir', {message})
});


module.exports = router;
