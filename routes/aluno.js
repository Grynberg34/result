const express = require('express');
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

router.get('/', checkAuthentication, function(req, res) {
  var user_id = req.user.id
  res.redirect(`/aluno/${user_id}`)
});

router.get('/:id', checkAuthentication, function(req, res) {
  var id = req.params.id
  var user_id = req.user.id
  if(user_id == id) {
    res.render('aluno', {user_id})
  }
  else res.redirect('/')
});


module.exports = router;
