const express = require('express');
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

router.get('/', function(req, res) {
  res.render('emconstrucao')
});

router.get('/1', checkAuthentication, function(req, res) {
  
});

module.exports = router;