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

router.get('/', checkAuthentication, alunoController.checarTurmaAluno, alunoController.mostrarMenuInicial);

router.get('/aulas', checkAuthentication, alunoController.checarTurmaAluno, alunoController.mostrarAulasSemestre);

router.get('/materiais', checkAuthentication, alunoController.checarTurmaAluno, alunoController.mostrarMateriais);

router.get('/materiais/:id', checkAuthentication, alunoController.checarTurmaAluno, alunoController.mostrarMateriaisColecao);

router.get('/avaliacoes', checkAuthentication, alunoController.checarTurmaAluno, alunoController.mostrarAvaliacoes);

router.get('/avaliacoes/:id', checkAuthentication, alunoController.checarTurmaAluno, alunoController.mostrarAvaliacaoAluno);

router.post('/avaliacoes/:id', checkAuthentication, alunoController.checarTurmaAluno, alunoController.adicionarResposta, alunoController.receberRespostasAvaliacao);

module.exports = router;
