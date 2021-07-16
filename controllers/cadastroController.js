const User = require('../models/User');
const Code = require('../models/Code');
const bcrypt = require('bcrypt');

module.exports= {

    cadastrar: function (req,res) {
        var name = req.body.name;
        var email = req.body.email;
        var code = req.body.code;
        var password = req.body.password;
        var repeat = req.body.repeatpassword;
        var userexists = "Esse email ou nome já foi utilizado por outro usuário.";
        var passdontmatch = "As senhas não coincidem.";
        var invalidcode = 'Código da empresa inválido.';
      

        if (password == repeat) {
            Code.count({
                where: {
                  codigo: code
                }
            }).then(async function (count) {
                if (count < 1) {
                    res.render('cadastro', {invalidcode})
                }
                else if (count > 0) {
                    var hashed = bcrypt.hashSync(password, 10);
                    try {
                        var user =  await User.create({ nome: name, email: email, password: hashed, tipo_conta: 'aluno' });
                        console.log(user);
                        res.redirect('/login');
                    }
                    catch(err){
                        console.log(err)
                        res.render('cadastro', {userexists})
                    }
                }
            })
        }
        else res.render('cadastro', {passdontmatch})
    }
}
