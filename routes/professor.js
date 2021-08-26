const express = require('express');
const professorController = require('../controllers/professorController');
const router = express.Router();

function checkAuthentication(req,res,next){
  if (req.isAuthenticated()) {
    if(req.user.tipo_conta == 'admin'){
      res.redirect('/admin')
    }
  
    else if (req.user.tipo_conta == 'aluno') {
      res.redirect('/aluno')
    }

    else if (req.user.tipo_conta == 'professor') {
      next()
    }
  }
  else{
    res.redirect('/')
  }
}

router.get('/', checkAuthentication, professorController.mostrarTurmasProfessor);

router.get('/:id', checkAuthentication, professorController.mostrarMenuSemestreTurma);

router.get('/:id/aulas', checkAuthentication, professorController.mostrarAulasSemestreTurma);

router.post('/:id/aulas', checkAuthentication, professorController.editarAula);

router.get('/:id/aulas/criar', checkAuthentication, function (req,res){
  var id = req.params.id;
  res.render('professor-turma-aulas-criar', {id});
});

router.post('/:id/aulas/criar', checkAuthentication, professorController.criarAula);

router.get('/:id/aulas/chamada/:sid', checkAuthentication, professorController.mostrarChamada);

router.post('/:id/aulas/chamada/:sid', checkAuthentication, professorController.fazerChamada);

router.get('/:id/materiais', checkAuthentication, professorController.mostrarMaterial);

router.get('/:id/alunos', checkAuthentication, professorController.mostrarAlunos);

router.get('/:id/alunos/:sid', checkAuthentication, professorController.mostrarAlunoPorId);

router.get('/:id/alunos/:sid/relatorio', checkAuthentication, professorController.gerarRelatorioAluno);

router.get('/:id/avaliacoes', checkAuthentication, professorController.mostrarAvaliacoes);

router.get('/:id/avaliacoes/criar', checkAuthentication, professorController.mostrarFormularioAvaliacoes);

router.post('/:id/avaliacoes/criar', checkAuthentication, professorController.criarAvaliacaoSemestre);

module.exports = router;
