const express = require('express');
const router = express.Router();
const passport = require('passport');

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

router.get('/', checkAuthentication, function(req, res) {
  res.render('login',  { message: req.flash('message') })
});

router.post('/', passport.authenticate('users',{successRedirect:'/user', failureRedirect: '/login', failureFlash: true }));

router.get('/admin', checkAuthentication, function(req, res) {
  res.render('login',  { message: req.flash('message') })
});

router.post('/admin', passport.authenticate('admin', {successRedirect:'/admin', failureRedirect: '/login/admin', failureFlash: true }));

module.exports = router;
