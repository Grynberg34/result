const express = require('express');
const router = express.Router();
const connection = require('../db/connection');


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
 res.render('quemsomos')
});

module.exports = router;
