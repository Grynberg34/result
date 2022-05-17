const Aluno = require("../models/Aluno");
const Professor = require("../models/Professor");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const User = require("../models/User");
const Aula = require("../models/Aula");
const Chamada = require("../models/Chamada");
const Gabarito = require("../models/Gabarito");
const Material = require("../models/Material");
const Avaliação_Semestre = require("../models/Avaliação_Semestre");
const Avaliação = require("../models/Avaliação");
const Avaliação_Nota = require("../models/Avaliação_Nota");
const Avaliação_Resposta = require("../models/Avaliação_Resposta");
const Link_Aula = require("../models/Link_Aula");

module.exports = {

    checarTurmaAluno: async function (req,res,next) {
        var id = req.user.id;
        var aluno = await Aluno.findOne({ where: {userId: id}});

        if (!aluno.turmaId) {
            res.redirect('/logout');
        }

        else {
            next();
        }

    },

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


        console.log(semestre[0].professorId)

        var professor = await Professor.findOne({
        where: { id: semestre[0].professorId },
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
            var aulas = await Aula.findAll({where:{ semestreId: semestre[0].id },
                order: [
                    ['numero_aula', 'DESC'],
                ]
            });

            for (var i=0; i < aulas.length; i++) {
                var links = await Link_Aula.findAll({where:
                {
                    aulaId: aulas[i].id
                }})
    
                aulas[i].links = links
            };

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
                };
    
                var num_presenças = presenças.length;

                if (num_aulas == 0) {
                    var percentual = 0;
                }
                
                else {
                    var percentual = Math.floor(((num_presenças * 100) / num_aulas));
                }

                res.render('aluno-aulas', {aulas, chamadas, num_aulas, num_presenças, percentual});
            })
            .catch(function(err){
                res.render('error');
                console.log(err);
            })

        })
        .catch(function(err){
            res.render('error');
            console.log(err);
        })


    },

    mostrarMateriais: async function (req,res) {
        var id = req.user.id;

        var aluno = await Aluno.findOne({where: {userId: id}});

        var niveis = [];

        var semestreAtual = await Semestre.findOne({
            where: {
                turmaId: aluno.turmaId,
                concluido: 0
            }
        });

        niveis.push(semestreAtual.nivel)


        Chamada.findAll({where: {alunoId: aluno.id}}).then(async function(chamadas){

            
            
            for (var i=0; i < chamadas.length; i++) {
                var aula = await Aula.findOne({where: {id: chamadas[i].aulaId}});

                var semestre = await Semestre.findOne({where: { id: aula.semestreId}});

                if (!niveis.includes(semestre.nivel)) {
                    niveis.push(semestre.nivel)
                }

            }


            var materiais = [];

            for (var i=0; i < niveis.length; i++) {
                
                await Material.findAll({where: {nivel: niveis[i]},
                order: [['nome', 'ASC']]}).then(function(materiais_nivel){


                    for (var i=0; i < materiais_nivel.length; i++) {
                        materiais.push(materiais_nivel[i])
                    }

                })        
                .catch(function(err){
                    res.render('error');
                    console.log(err);
                });

            };

            res.render('aluno-materiais', {materiais, niveis});

        })
        .catch(function(err){
            res.render('error');
            console.log(err);
        });

    },

    mostrarAvaliacoes: async function (req,res) {
        var id = req.user.id;
        var aluno = await Aluno.findOne({where: {userId: id}});

        Semestre.findAll({where: {turmaId: aluno.turmaId},
            limit: 1,
            order: [['id', 'DESC']],
            include: [Turma]
        }).then(async function(semestre){
            var avaliacoes = await Avaliação_Semestre.findAll({where: {semestreId: semestre[0].id},
                order: [['numero', 'ASC']],
                include: [Avaliação]
            });

            var pontos = 0;

            for (var i=0; i < avaliacoes.length; i++) {
                
                var nota = await Avaliação_Nota.findOne({where: {avaliação_semestreId: avaliacoes[i].id, alunoId: aluno.id}});

                if (nota) {
                    avaliacoes[i].disponivel = false;
                    pontos = pontos + nota.nota;
                    avaliacoes[i].nota = nota.nota;
                }
            }

            res.render('aluno-avaliacoes', {avaliacoes, pontos});
        })
        .catch(function(err){
            res.render('error');
            console.log(err);
        });

    },
}