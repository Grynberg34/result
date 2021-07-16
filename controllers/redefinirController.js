const User = require('../models/User');
const nodemailer = require ('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: 'result.suporte@gmail.com',
      pass: 'urvgwsqnmbyxyjqo'
    },
    tls: {
      rejectUnauthorized: false
    }
}));

module.exports= {

    pedirRefinicaoSenha: function (req,res) {
        var email = req.body.email;
        var emailnotfound = 'Não existe nenhuma conta com esse email.';
        var code = uuidv4();
        
        User.findOne({ where: {email: email} }).then(user => {
            if (!user) {
                res.render('redefinir', {emailnotfound})
            }   
            
            if (user) {
                user.update({
                    token_redefinir: code
                })

                var mailOptions = {
                    from: 'Result English - Suporte english.suporte@gmail.com',
                    to: `${email}`,
                    subject: 'Criar Nova Senha- Result ',
                    text: `Use este código para criar uma nova senha: ${code}`
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                res.render('mudar')
            }
        })
    },

    mudarSenha: function (req,res) {
        var emailcode = req.body.code;
        var password = req.body.password;
        var repeat = req.body.repeatpassword;
        var message = 'Senhas não coincidem.';
        var message2 = 'Código errado. Tente novamente.';
        var hashedpassword = bcrypt.hashSync(password, 10);
        if (password == repeat){

            User.findOne({ where: {token_redefinir: emailcode} }).then(user => {
                if (!user) {
                    res.render('mudar', {message2})
                }

                if (user) {
                    user.update({
                        password: hashedpassword,
                        token_redefinir: null
                    })

                    res.render('sucesso')
                }

            })

        } 
        else return res.render('redefinir', {message})
    }
    
}
