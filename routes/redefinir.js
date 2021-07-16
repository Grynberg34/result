const express = require('express');
const redefinirController = require('../controllers/redefinirController');
const router = express.Router();

function checkAuthentication(req,res,next){
  if (req.isAuthenticated()) {
    if(req.user.tipo_conta == 'professor'){
      res.redirect('/professor')
    }
  
    else if (req.user.tipo_conta == 'aluno') {
      res.redirect('/aluno')
    }

    else if (req.user.tipo_conta == 'admin') {
      res.redirect('/admin')
    }
  }
  else{
    next()
  }
}

router.get('/', checkAuthentication, function(req, res) {
  res.render('redefinir')
});

router.post('/', checkAuthentication, redefinirController.pedirRefinicaoSenha);

router.post('/mudar', checkAuthentication, redefinirController.mudarSenha);

module.exports = router;