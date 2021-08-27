const Aluno = require("../models/Aluno");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const User = require("../models/User");

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
                res.render('error')
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
                res.render('error')
                console.log(err)
            })
        }

    },

    deletarAluno: async function (req,res) {
        var del = req.body.del;

        User.destroy({where: {id: del}})
        .then(function(){
            res.redirect('/admin/alunos');
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        });
    },

    criarTurma: async function (req,res) {
        var turma = req.body.turma;

        Turma.create({nome: turma})
        .then(function(){
            res.redirect('/admin/turmas/ver');
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
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

}