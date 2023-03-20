const Aluno = require("../models/Aluno");
const Professor = require("../models/Professor");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const User = require("../models/User");
const Aula = require("../models/Aula");
const Chamada = require("../models/Chamada");
const Avaliação_Nota = require("../models/Avaliação_Nota");
const Avaliação = require("../models/Avaliação");
const Avaliação_Semestre = require("../models/Avaliação_Semestre");
const pdf = require("pdf-creator-node");
const fs = require('fs');

module.exports = {


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
        var link = req.body.link;
        var professor = req.body.professores;

        Semestre.update(
            { concluido: true },
            { where: { 
                concluido: false,
                turmaId: id } 
            }
        ).then(function(){

            Semestre.create({data: data, nivel: nivel, link_aulas: link, professorId: professor, turmaId: id}).then(function(){
                res.redirect(`/admin/turmas/ver/${id}`);
            })

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
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

        Semestre.update(
            { concluido: true },
            { where: { id: semestre } }
        )
        .then(function(){
            res.redirect(`/admin/turmas/ver/${id}`);
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })
    },

    alterarLinkSemestre: async function (req,res) {
        var link = req.body.link;
        var id_semestre = req.params.sid;
        var id = req.params.id;

        Semestre.update(
            { link_aulas: link },
            { where: { id: id_semestre } }
        )
        .then(function(){
            res.redirect(`/admin/turmas/ver/${id}/semestres/${id_semestre}`);
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })
    },

    gerarRelatorioSemestre: async function (req,res) {
        var sid = req.params.sid;

        var pdf_number = Math.floor(Math.random() * 10001);
        const doc = new PDFDocument();

        var alunos_id = [];

        var aulas = await Aula.findAll({where: {semestreId: sid}});

        for (var i=0; i < aulas.length; i++) {

            var ids = await Chamada.findAll({
                where: { aulaId: aulas[i].id },
                attributes: ['alunoId']
            });

            if (ids.length > 0) {
                for (var e = 0; e < ids.length; e++)
                {
                    if (!alunos_id.includes(ids[e].alunoId)) {
                        alunos_id.push(ids[e].alunoId)
                    }
                }
            }


        }

        var alunos = await Aluno.findAll({where: {
            id: alunos_id
        },
        include: [User],
        order: [[`User`, `nome`, `ASC`]]});

        var semestre = await Semestre.findByPk(sid, {
            include: [Turma]
        });


        res.redirect('/')

    },

}