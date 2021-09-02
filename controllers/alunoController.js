const Aluno = require("../models/Aluno");
const Professor = require("../models/Professor");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const User = require("../models/User");
const Aula = require("../models/Aula");
const Chamada = require("../models/Chamada");

module.exports = {
    mostrarMenuInicial: async function (req,res) {
        var id = req.user.id;

        var aluno = await Aluno.findOne(
        {
            where: {userId: id},
            include: [User]
        });

        var semestre = await Semestre.findAll({where: {turmaId: aluno.turmaId},
            limit: 1,
            order: [['id', 'DESC']],
            include: [Turma]
        });


        var professor = await Professor.findOne({
            id: { id: semestre.professorId },
            include: [User]
        });

        res.render('aluno', {aluno, semestre, professor});
    },
    
    mostrarAulasSemestre: async function (req,res) {
        var id = req.user.id;

        var aluno = await Aluno.findOne(
        {
            where: {userId: id},
            include: [User]
        });

        Semestre.findAll({where: {turmaId: aluno.turmaId},
            limit: 1,
            order: [['id', 'DESC']],
            include: [Turma]
        })
        .then(async function(semestre){
            var aulas = await Aula.findAll({where:{ semestreId: semestre[0].id }});

            Aula.findAll({where: {
                semestreId: semestre[0].id,
                chamada: true
            }}).then(async function(aulasChamada) {
    
                var chamadas = [];
    
                var num_aulas = aulasChamada.length;
    
                var presenças = [];
    
                for (var i=0; i < aulasChamada.length; i++) {
                    var chamada = await Chamada.findAll({where: {
                        aulaId: aulasChamada[i].id,
                        alunoId: aluno.id
                    }, 
                    include: [Aula]})
    
                    if (chamada[0] && (chamada[0].presença == true)) {
                        presenças.push(chamada[0]);
                    }
    
                    chamadas.push(chamada[0])
                }
    
                var num_presenças = presenças.length;
    
                var percentual = Math.floor(((num_presenças * 100) / num_aulas));

                res.render('aluno-aulas', {aulas, chamadas, num_aulas, num_presenças, percentual})
            })
            .catch(function(err){
                res.render('error')
                console.log(err)
            })

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })


    }
}