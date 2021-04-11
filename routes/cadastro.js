const express = require('express');
const router = express.Router();


router.get('/', function(_, res) {
  res.render('emconstrucao')
});

module.exports = router;