const Professor = require("../models/Professor");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const Aula = require("../models/Aula");
const Aluno = require("../models/Aluno");
const User = require("../models/User");
const Chamada = require("../models/Chamada");
const Material = require("../models/Material");

module.exports = {

    mostrarTurmasProfessor: async function (req,res) {
        var user_id = req.user.id;

        await Professor.findOne({where: { userId: user_id} })
        .then(async function(professor) {
            var semestres = await Semestre.findAll({where: {professorId: professor.id, concluido: false },
                include: [Turma],
            });
            console.log(semestres)
            res.render('professor', {semestres})

        })
    
    },

    mostrarMenuSemestreTurma: async function (req,res) {
        var id = req.params.id;

        var semestre = await Semestre.findByPk(id, {
            include: [Turma],
        });

        res.render('professor-turma', {semestre})

    },

    mostrarAulasSemestreTurma: async function (req,res) {
        var id = req.params.id;

        var aulas = await Aula.findAll({where: {semestreId: id}});

        for (var i=0; i < aulas.length; i++) {


            var chamadas = await Chamada.findAll({where: {
                aulaId: aulas[i].id
            },
            include: [{
                model: Aluno,
                include: User
            }]})

            aulas[i].chamadas = chamadas

            console.log(aulas[i].chamadas)

        }


        res.render('professor-turma-aulas', {aulas, id})

    },

    criarAula: async function (req,res) {
        var id = req.params.id;
        var numero = req.body.numero;
        var data = req.body.data;
        var tema = req.body.tema;
        var comentarios = req.body.comentarios;

        await Aula.create({
            numero_aula: numero,
            data: data,
            tema: tema,
            comentarios: comentarios,
            semestreId: id
        }).then(function(){

            res.redirect(`/professor/${id}/aulas`)

        })


    },

    editarAula: async function (req,res) {
        var id = req.params.id;
        var aula = req.body.aula;
        var comentarios = req.body.comentarios;
        var tema = req.body.tema;

        Aula.update(           
            {   
                comentarios: comentarios, 
                tema: tema
            },
            { where: { id: aula } 
        }).then(function(){

            res.redirect(`/professor/${id}/aulas`)

        })

    },

    mostrarChamada: async function (req,res) {
        var id = req.params.id;

        Semestre.findByPk(id).then(async function (semestre){
            var alunos = await Aluno.findAll({where: {
                turmaId: semestre.turmaId
            },
            include: [User]})

            res.render('professor-turma-aulas-chamada', {alunos});
        
        })

    },

    fazerChamada: async function (req,res) {
        var id = req.params.id;
        var sid = req.params.sid;
        var alunos = req.body.alunos;
        var array_alunos = JSON.parse("[" + alunos + "]");

        array_alunos.forEach(function(i) {

            if (req.body[i] == 'on') {
                var presença = true
            }

            else if (req.body[i] == undefined) {
                var presença = false
            }
            
            Chamada.create({
                alunoId: i,
                aulaId: sid,
                presença: presença
            }).then(function(){
                Aula.update({
                    chamada: true
                },
                {where: { 
                    id: sid
                }})
            })

        });

        res.redirect(`/professor/${id}/aulas`)
        
    },

    mostrarMaterial: async function (req,res) {
        var id = req.params.id;

        Semestre.findByPk(id).then(async function (semestre) {

            console.log(semestre.nivel)

            var materiais = await Material.findAll({where: {nivel: semestre.nivel},
                order: [['nome', 'ASC']]})
            console.log(materiais)

            res.render('professor-materiais', {materiais, id})

        })


    },

    mostrarAlunos: async function (req,res) {
        var id = req.params.id;

        Semestre.findByPk(id).then(async function(semestre){

            var alunos =  await Aluno.findAll({where: {
                turmaId: semestre.turmaId
            },
            include: [User]})

            res.render('professor-alunos', {alunos, id})

        })

    },

    mostrarAlunoPorId: async function (req,res) {
        var id = req.params.id;
        var sid = req.params.sid;

        var aluno = await Aluno.findByPk(sid, {
            include: [User]
        });

        var semestre = await Semestre.findByPk(id, {
            include: [Turma]
        });

        Aula.findAll({where: {
            semestreId: id,
            chamada: true
        }}).then(async function(aulas) {

            var chamadas = [];

            var num_aulas = aulas.length;

            var presenças = [];

            for (var i=0; i < aulas.length; i++) {
                var chamada = await Chamada.findAll({where: {
                    aulaId: aulas[i].id,
                    alunoId: sid
                }, 
                include: [Aula]})

                if (chamada[0] && (chamada[0].presença == true)) {
                    presenças.push(chamada[0]);
                }

                chamadas.push(chamada[0])
            }

            var num_presenças = presenças.length;

            var percentual = Math.floor(((num_presenças * 100) / num_aulas))

            res.render('professor-alunos-aluno', {aluno, semestre, id, chamadas, num_aulas, num_presenças, percentual})
        })

    }

}