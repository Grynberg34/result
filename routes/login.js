const express = require('express');
const router = express.Router();
const passport = require('passport');

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
  res.render('login',  { message: req.flash('message') })
});

router.post('/', passport.authenticate('users',{successRedirect:'/aluno', failureRedirect: '/login', failureFlash: true }));

module.exports = router;
