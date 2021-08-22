const express = require('express');
const adminController = require('../controllers/adminController');
const avaliacoesController = require('../controllers/avaliacoesController');
const materiaisController = require('../controllers/materiaisController');
const semestresController = require('../controllers/semestresController');
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
      next()
    }
  }
  else{
    res.redirect('/')
  }
}

router.get('/', checkAuthentication, function(req, res) {
 res.render('admin')
});

router.get('/alunos', checkAuthentication, adminController.mostrarAlunos);

router.post('/alunos/editar', checkAuthentication, adminController.editarTurmaAluno);

router.post('/alunos/deletar', checkAuthentication, adminController.deletarAluno);

router.get('/turmas', checkAuthentication, function(req, res) {
  res.render('admin-turmas')
});

router.get('/turmas/criar', checkAuthentication, function(req, res) {
  res.render('admin-turmas-criar')
});

router.post('/turmas/criar', checkAuthentication, adminController.criarTurma);

router.get('/turmas/ver', checkAuthentication, adminController.mostrarTurmas);

router.get('/turmas/ver/:id', checkAuthentication, adminController.mostrarTurmaPorId);

router.get('/turmas/ver/:id/criar-semestre', checkAuthentication, semestresController.mostrarFormularioSemestre);

router.post('/turmas/ver/:id/criar-semestre', checkAuthentication, semestresController.criarSemestre);

router.get('/turmas/ver/:id/semestres/:sid', checkAuthentication, semestresController.mostrarSemestre);

router.post('/turmas/ver/:id/semestres/:sid', checkAuthentication, semestresController.concluirSemestre);

router.post('/turmas/ver/:id/semestres/:sid/alterar-link', checkAuthentication, semestresController.alterarLinkSemestre);

router.get('/materiais', checkAuthentication, materiaisController.mostrarMenuMateriais);

router.get('/materiais/nivel/:id', checkAuthentication, materiaisController.mostrarMateriaisPorNivel);

router.post('/materiais/nivel/:id', checkAuthentication, materiaisController.removerMaterial);

router.get('/materiais/adicionar', checkAuthentication, function(req, res) {
  res.render('admin-materiais-adicionar');
});

router.post('/materiais/adicionar', checkAuthentication, materiaisController.adicionarPastaMaterial, materiaisController.adicionarMaterial);

router.get('/avaliacoes', checkAuthentication, function(req, res) {
  res.render('admin-avaliacoes');
});

router.get('/avaliacoes/criar', checkAuthentication, function(req, res) {
  res.render('admin-avaliacoes-criar');
});

router.post('/avaliacoes/criar', checkAuthentication, avaliacoesController.criarAvaliacao);

router.get('/avaliacoes/ver', checkAuthentication, avaliacoesController.mostrarMenuAvaliacoes);

router.get('/avaliacoes/ver/:id', checkAuthentication, avaliacoesController.mostrarAvaliacoesPorNivel);

router.get('/avaliacoes/ver/:id/:sid', checkAuthentication, avaliacoesController.mostrarAvaliacao);

router.get('/avaliacoes/ver/:id/:sid/editar', checkAuthentication, avaliacoesController.mostrarEditorAvaliacao);

router.post('/avaliacoes/ver/:id/:sid/editar', checkAuthentication, avaliacoesController.editarAvaliacao);

router.post('/avaliacoes/ver/:id/:sid/deletar', checkAuthentication, avaliacoesController.deletarAvaliacao);

module.exports = router;
