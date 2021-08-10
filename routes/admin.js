const express = require('express');
const adminController = require('../controllers/adminController');
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

router.get('/turmas/ver/:id/criar-semestre', checkAuthentication, adminController.mostrarFormularioSemestre);

router.post('/turmas/ver/:id/criar-semestre', checkAuthentication, adminController.criarSemestre);

router.get('/turmas/ver/:id/semestres/:sid', checkAuthentication, adminController.mostrarSemestre);

router.post('/turmas/ver/:id/semestres/:sid', checkAuthentication, adminController.concluirSemestre);

router.get('/materiais', checkAuthentication, adminController.mostrarMenuMateriais);

router.get('/materiais/nivel/:id', checkAuthentication, adminController.mostrarMateriaisPorNivel);

router.get('/materiais/adicionar', checkAuthentication, function(req, res) {
  res.render('admin-materiais-adicionar');
});

router.post('/materiais/adicionar', checkAuthentication, adminController.adicionarPastaMaterial, adminController.adicionarMaterial);

module.exports = router;
