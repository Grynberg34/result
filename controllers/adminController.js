const Aluno = require("../models/Aluno");
const Material = require("../models/Material");
const Professor = require("../models/Professor");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const User = require("../models/User");

const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/materiais/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  dest: 'public/materiais/',
  storage: storage
})

module.exports = {

    mostrarAlunos: async function (req,res) {
        var alunos = await Aluno.findAll({
            include: [User, Turma],
        },
        {order: [['nome', 'ASC']]}
        );

        var turmas = await Turma.findAll({order: [['nome', 'ASC']]});
        res.render('admin-alunos', {alunos, turmas})
    },

    editarTurmaAluno: async function (req,res) {
        var aluno_id = req.body.aluno;
        var turma = req.body.turmas;

        if (turma == 'nenhuma') {
            Aluno.update(
                { turmaId: null },
                { where: { id: aluno_id } }
            )
            .then(function(){
                console.log('Update 1');
                res.redirect('/admin/alunos');
            })
            .catch(function(err){
                console.log(err)
            })
        }

        else {
            Aluno.update(
                { turmaId: turma },
                { where: { id: aluno_id } }
            )
            .then(function(){
                res.redirect('/admin/alunos');
            })
            .catch(function(err){
                console.log(err)
            })
        }

    },

    deletarAluno: async function (req,res) {
        var del = req.body.del;

        await User.destroy({where: {id: del}})
        .then(function(){
            res.redirect('/admin/alunos');
        });
    },

    criarTurma: async function (req,res) {
        var turma = req.body.turma;

        await Turma.create({nome: turma})
        .then(function(){
            res.redirect('/admin/turmas/ver');
        });
    },

    mostrarTurmas: async function (req,res) {

        var turmas = await Turma.findAll({order: [['nome', 'ASC']]});

        res.render('admin-turmas-ver', {turmas})

    },

    mostrarTurmaPorId: async function (req,res) {
        var id = req.params.id;

        var turma = await Turma.findByPk(id);

        var alunos = await Aluno.findAll({
            include: [User],
            where: {turmaId : id},
        },
        {order: [['nome', 'ASC']]}
        );

        var atual = await Semestre.findAll({where: {turmaId: id, concluido : false}});

        var concluidos = await Semestre.findAll({where: {turmaId: id, concluido : true}});

        res.render('admin-turmas-turma', {turma, alunos, atual, concluidos});
    },

    mostrarFormularioSemestre: async function (req,res) {
        var id = req.params.id;

        var turma = await Turma.findByPk(id);

        var professores = await Professor.findAll({
            include: [User],
        },
        {order: [['nome', 'ASC']]}
        );

        res.render('admin-semestres-criar', {turma, professores});
    },

    criarSemestre: async function (req,res) {
        var id = req.params.id;
        var data = req.body.data;
        var nivel = req.body.nivel;
        var professor = req.body.professores;

        await Semestre.create({data: data, nivel: nivel, professorId: professor, turmaId: id}).then(function(){
            res.redirect(`/admin/turmas/ver/${id}`);
        })
    },

    mostrarSemestre: async function (req,res) {
        var id = req.params.sid;

        var semestre = await Semestre.findByPk(id, {
            include: [Turma, {
                model: Professor,
                include: [User]
              }],
        })

        res.render('admin-semestres-semestre', {semestre, id});

    },

    concluirSemestre: async function (req,res) {
        var semestre = req.body.semestre;
        var id = req.params.id;

        console.log(semestre);

        Semestre.update(
            { concluido: true },
            { where: { id: semestre } }
        )
        .then(function(){
            res.redirect(`/admin/turmas/ver/${id}`);
        })
        .catch(function(err){
            console.log(err)
        })
    },

    mostrarMenuMateriais: async function (req,res) {

        var niveis = await Material.findAll({group: 'nivel',
        order: [['nivel', 'ASC']]});

        res.render('admin-materiais', {niveis});
    },

    mostrarMateriaisPorNivel: async function (req,res) {
        var id= req.params.id;
        var materiais = await Material.findAll({where: {nivel: id},
        order: [['nome', 'ASC']]})

        res.render('admin-materiais-nivel', {materiais, id});
    },

    adicionarPastaMaterial: upload.single('zip'),

    adicionarMaterial: async function (req,res) {
        var nome = req.body.nome;
        var nivel = req.body.nivel;
        console.log(nome)
        console.log(nivel)
        console.log(req.file)

        res.redirect('/admin/materiais');
    }

}