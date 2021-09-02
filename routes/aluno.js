const express = require('express');
const alunoController = require('../controllers/alunoController');
const router = express.Router();

function checkAuthentication(req,res,next){
  if (req.isAuthenticated()) {
    if(req.user.tipo_conta == 'professor'){
      res.redirect('/professor')
    }
  
    else if (req.user.tipo_conta == 'admin') {
      res.redirect('/admin')
    }

    else if (req.user.tipo_conta == 'aluno') {
      next()
    }
  }
  else{
    res.redirect('/')
  }
}

router.get('/', checkAuthentication, alunoController.mostrarMenuInicial);

router.get('/aulas', checkAuthentication, alunoController.mostrarAulasSemestre);

module.exports = router;
