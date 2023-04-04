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

router.get('/:id', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarMenuSemestreTurma);

router.get('/:id/aulas', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarAulasSemestreTurma);

router.post('/:id/aulas', checkAuthentication, professorController.checarSemestreProfessor, professorController.editarAula);

router.get('/:id/aulas/criar', checkAuthentication, professorController.checarSemestreProfessor, function (req,res){
  var id = req.params.id;
  res.render('professor-turma-aulas-criar', {id});
});

router.post('/:id/aulas/criar', checkAuthentication, professorController.checarSemestreProfessor, professorController.criarAula);

router.post('/:id/aulas/link', checkAuthentication, professorController.checarSemestreProfessor, professorController.adicionarLink);

router.post('/:id/aulas/link/deletar', checkAuthentication, professorController.checarSemestreProfessor, professorController.deletarLink);

router.get('/:id/aulas/chamada/:sid', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarChamada);

router.post('/:id/aulas/chamada/:sid', checkAuthentication, professorController.checarSemestreProfessor, professorController.fazerChamada);

router.get('/:id/materiais', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarColecoes);

router.get('/:id/materiais/:sid', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarMaterial);

router.get('/:id/alunos', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarAlunos);

router.get('/:id/alunos/:sid', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarAlunoPorId);

router.get('/:id/avaliacoes', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarAvaliacoes);

router.post('/:id/avaliacoes', checkAuthentication, professorController.checarSemestreProfessor, professorController.abrirFecharAvaliacao);

router.post('/:id/avaliacoes/gabarito', checkAuthentication, professorController.checarSemestreProfessor, professorController.abrirFecharGabarito);

router.get('/:id/avaliacoes/criar', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarFormularioAvaliacoes);

router.post('/:id/avaliacoes/criar', checkAuthentication, professorController.checarSemestreProfessor, professorController.criarAvaliacaoSemestre);

router.get('/:id/avaliacoes/corrigir', checkAuthentication, professorController.checarSemestreProfessor, function (req,res){
  var id = req.params.id;
  res.redirect(`/professor/${id}/avaliacoes`)
});

router.get('/:id/avaliacoes/corrigir/:sid', checkAuthentication, professorController.checarSemestreProfessor, professorController.mostrarRespostasAvaliacao);

router.post('/:id/avaliacoes/corrigir/:sid', checkAuthentication, professorController.checarSemestreProfessor, professorController.salvarNotaAvaliacao);

router.post('/:id/avaliacoes/corrigir/:sid/deletar', checkAuthentication, professorController.checarSemestreProfessor, professorController.deletarEnvioAvaliacao);

module.exports = router;
