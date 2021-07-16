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

router.get('/pt', checkAuthentication, function(req, res) {
  res.render('login-pt',  { message: req.flash('message') })
});

router.post('/', function(req,res,next) {

  passport.authenticate('users', function(err, user,info){
    if (!user) {
      req.session.save(
        function() {
          return res.redirect('/login')
        }
      )
    }
    else if (user) {
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/aluno');
      });
    }
  })(req,res,next)

});

module.exports = router;