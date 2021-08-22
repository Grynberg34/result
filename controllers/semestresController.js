const Professor = require("../models/Professor");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const User = require("../models/User");

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
            console.log(err)
        })
    },


}