const Professor = require("../models/Professor");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const Aula = require("../models/Aula");
const Aluno = require("../models/Aluno");
const User = require("../models/User");
const Chamada = require("../models/Chamada");
const Material = require("../models/Material");
const Avaliação = require("../models/Avaliação");
const Avaliação_Nota = require("../models/Avaliação_Nota");
const Avaliação_Semestre = require("../models/Avaliação_Semestre");
const Avaliação_Resposta = require("../models/Avaliação_Resposta");
const Link_Aula = require("../models/Link_Aula");
const fs = require('fs');


module.exports = {

    mostrarTurmasProfessor: async function (req,res) {
        var user_id = req.user.id;

        Professor.findOne({where: { userId: user_id} })
        .then(async function(professor) {
            var semestres = await Semestre.findAll({where: {professorId: professor.id, concluido: false },
                include: [Turma],
                order: [[`Turma`, `nome`, `ASC`]]
            });
            res.render('professor', {semestres})

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })
    
    },

    checarSemestreProfessor: async function (req,res, next) {
        var id = req.params.id;

        var professor = await Professor.findOne({where: {
            userId: req.user.id
        }});

        var semestre = await Semestre.findOne({where: {
            id: id,
            professorId: professor.id
        }});

        if (semestre == null) {
            res.redirect('/professor')
        }

        else {
            next();
        }

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

        var aulas = await Aula.findAll({where: {semestreId: id},
            order: [
                ['numero_aula', 'DESC'],
            ]}
        );

        for (var i=0; i < aulas.length; i++) {


            var chamadas = await Chamada.findAll({where: {
                aulaId: aulas[i].id
            },
            include: [{
                model: Aluno,
                include: User,
                order: [[`User`, `nome`, `ASC`]]
            }],
            order: [[`Aluno`,`User`, `nome`, `ASC`]]})

            aulas[i].chamadas = chamadas;

        }

        for (var i=0; i < aulas.length; i++) {
            var links = await Link_Aula.findAll({where:
            {
                aulaId: aulas[i].id
            }})

            aulas[i].links = links
        }

        res.render('professor-turma-aulas', {aulas, id})

    },

    adicionarLink: async function (req,res) {
        var id = req.params.id;
        var numero_aula = req.body.numero_aula;
        var nome = req.body.nome;
        var link = req.body.link;


        await Link_Aula.create({
            nome: nome,
            link: link,
            aulaId: numero_aula
        })

        res.redirect(`/professor/${id}/aulas`);

    },

    deletarLink: async function (req,res) {
        var id= req.params.id;
        var link = req.body.link;

        await Link_Aula.destroy({where: {
            id: link
        }});

        res.redirect(`/professor/${id}/aulas`);
    },

    criarAula: async function (req,res) {
        var id = req.params.id;
        var data = req.body.data;
        var tema = req.body.tema;
        var comentarios = req.body.comentarios;

        var aulas = await Aula.findAll({where: {semestreId: id}});

        var numero = aulas.length + 1;

        await Aula.create({
            numero_aula: numero,
            data: data,
            tema: tema,
            comentarios: comentarios,
            semestreId: id
        }).then(function(){

            res.redirect(`/professor/${id}/aulas`)

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })


    },

    editarAula: async function (req,res) {
        var id = req.params.id;
        var aula = req.body.aula;
        var comentarios = req.body.comentarios;
        var tema = req.body.tema;
        var data = req.body.data;

        Aula.update(           
            {   
                comentarios: comentarios, 
                tema: tema,
                data: data
            },
            { where: { id: aula } 
        }).then(function(){

            res.redirect(`/professor/${id}/aulas`)

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })

    },

    mostrarChamada: async function (req,res) {
        var id = req.params.id;
        var sid = req.params.sid;

        var chamada = await Aula.findOne({
            where: {
                id : sid,
                chamada: true
            }
        });

        if (chamada) {
            res.redirect(`/professor/${id}/aulas`);
        }

        else {

            Semestre.findByPk(id).then(async function (semestre){
                var alunos = await Aluno.findAll({where: {
                    turmaId: semestre.turmaId
                },
                include: [User],
                order: [[`User`, `nome`, `ASC`]]})
    
                res.render('professor-turma-aulas-chamada', {alunos, id});
            
            })
            .catch(function(err){
                res.render('error')
                console.log(err)
            })

        }

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
            .catch(function(err){
                res.render('error')
                console.log(err)
            })

        });

        res.redirect(`/professor/${id}/aulas`)
        
    },

    mostrarColecoes: async function (req,res) {
        var id = req.params.id;

        Semestre.findByPk(id).then(async function (semestre) {

            var coleções = await Material.findAll({where: {nivel: semestre.nivel},
                group: 'coleção',
                order: [['coleção', 'ASC']]
            })

            res.render('professor-colecoes', {coleções, id})

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })


    },

    mostrarMaterial: async function (req,res) {
        var id = req.params.id;
        var coleção_nome = req.params.sid;

        var materiais = await Material.findAll({order: [['nome', 'ASC']],
            where: {
            coleção: coleção_nome
        }});

        console.log(materiais)

        res.render('professor-colecoes-materiais', {id, coleção_nome, materiais})

    },

    mostrarAlunos: async function (req,res) {
        var id = req.params.id;

        Semestre.findByPk(id).then(async function(semestre){

            var alunos =  await Aluno.findAll({where: {
                turmaId: semestre.turmaId
            },
            include: [User],
            order: [[`User`, `nome`, `ASC`]]})

            res.render('professor-alunos', {alunos, id})

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
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

                chamadas.push(chamada[0]);
            }

            var num_presenças = presenças.length;

            var percentual = Math.floor(((num_presenças * 100) / num_aulas));

            var avaliacoes = await Avaliação_Semestre.findAll({where: {semestreId: semestre.id}});

            var notas = [];

            var pontos_aluno = 0;

            var pontos_total = 0;

            for (var i=0; i < avaliacoes.length; i++) {

                pontos_total = pontos_total + avaliacoes[i].pontos_total;

                var nota = await Avaliação_Nota.findOne({where:
                {
                    avaliação_semestreId : avaliacoes[i].id,
                    alunoId: aluno.id
                },
                include: [{
                    model: Avaliação_Semestre,
                    include: Avaliação
                }] });


                if (nota) {
                    notas.push(nota);
                    pontos_aluno = pontos_aluno + nota.nota;
                }

                if (pontos_aluno == 0 && pontos_total == 0) {
                    var percentual_pontos = 0
                }
    
                else {
                    var percentual_pontos = Math.floor(((pontos_aluno * 100) / pontos_total));
                }

            }

            res.render('professor-alunos-aluno', {aluno, semestre, id, chamadas, num_aulas, num_presenças, percentual, notas, pontos_aluno, pontos_total, percentual_pontos});
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })

    },

    mostrarAvaliacoes: async function (req,res) {
        var id = req.params.id;

        Semestre.findByPk(id).then(async function(semestre){
            
            var avaliacoes = await Avaliação_Semestre.findAll({where: {
                    semestreId: semestre.id
                },  include: [Avaliação],
                order: [['id', 'ASC']]
            });

            var notas_total = 0;

            for (var i=0; i < avaliacoes.length; i++) {


                var notas = await Avaliação_Nota.findAll({where: {
                    avaliação_semestreId: avaliacoes[i].id
                },
                include: [{
                    model: Aluno,
                    include: User
                }],
                order: [[`Aluno`,`User`, `nome`, `ASC`]]});
    
                avaliacoes[i].notas = notas;

                notas_total = notas_total + avaliacoes[i].pontos_total
    
            }

            res.render('professor-avaliacoes', {id, avaliacoes, notas_total})
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })


    },

    abrirFecharAvaliacao: async function (req,res) {
        var id = req.params.id;
        var a_id = req.body.a_id;

        Avaliação_Semestre.findByPk(a_id).then(function(avaliacao){

            if (avaliacao.disponivel == true) {
                Avaliação_Semestre.update(
                    { disponivel: false },
                    { where: { id: a_id } }
                ).then(function(){
                    return res.redirect(`/professor/${id}/avaliacoes`)
                })
                .catch(function(err){
                    res.render('error')
                    console.log(err)
                })
            }
            else if (avaliacao.disponivel == false) {

                Avaliação_Semestre.update(
                    { disponivel: true },
                    { where: { id: a_id } }
                ).then(function(){
                    return res.redirect(`/professor/${id}/avaliacoes`)
                })
                .catch(function(err){
                    res.render('error')
                    console.log(err)
                })

            }

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })


    },

    abrirFecharGabarito: async function (req,res) {
        var id = req.params.id;
        var a_id = req.body.a_id_gabarito;

        Avaliação_Semestre.findByPk(a_id).then(function(avaliacao){

            if (avaliacao.corrigido == true) {
                Avaliação_Semestre.update(
                    { corrigido: false },
                    { where: { id: a_id } }
                ).then(function(){
                    return res.redirect(`/professor/${id}/avaliacoes`)
                })
                .catch(function(err){
                    res.render('error')
                    console.log(err)
                })
            }
            else if (avaliacao.corrigido == false) {

                Avaliação_Semestre.update(
                    { corrigido: true },
                    { where: { id: a_id } }
                ).then(function(){
                    return res.redirect(`/professor/${id}/avaliacoes`)
                })
                .catch(function(err){
                    res.render('error')
                    console.log(err)
                })

            }

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })


    },

    mostrarFormularioAvaliacoes: async function (req,res) {
        var id = req.params.id;

        
        Semestre.findByPk(id).then(async function(semestre){
            
            var avaliacoes = await Avaliação.findAll({where: {
                nivel: semestre.nivel
                },
                order: [['coleção', 'ASC'], ['nome', 'ASC']]
            });

            res.render('professor-avaliacoes-criar', {id, avaliacoes})
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })


    },

    criarAvaliacaoSemestre: async function (req,res) {
        var id = req.params.id;
        var pontos = req.body.pontos;
        var a_id = req.body.a_id;

        Avaliação.findByPk(a_id).then(async function(avaliacao){

            var numero_anterior = await Avaliação_Semestre.findAll({where: {
                semestreId: id
            }});

            var numero_final = numero_anterior.length + 1;
            
            console.log(numero_final)

            Avaliação_Semestre.create({
                numero: numero_final,
                pontos_total: pontos,
                corrigido: false,
                semestreId: id,
                avaliaçãoId: avaliacao.id
            })

            res.redirect(`/professor/${id}/avaliacoes`)

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })
    },

    mostrarRespostasAvaliacao: async function (req,res) {
        var id = req.params.id;
        var sid = req.params.sid;

        var avaliacao = await Avaliação_Semestre.findByPk(sid, {
            include: [Avaliação]
        });

        var respostas = await Avaliação_Resposta.findAll({where:
        {
            avaliação_semestreId: sid
        },
        include: [{
            model: Aluno,
            include: User
            }]
        });

        var alunos = [];

        for (var i=0; i < respostas.length; i++) {

            if (alunos.indexOf(respostas[i].alunoId) === -1) {
                alunos.push(respostas[i].alunoId)
            }

        }

        for (var i=0; i < alunos.length; i++) {
            alunos[i] = await Aluno.findOne({where: {id: alunos[i]},
            include: [User]})

            var nota = await Avaliação_Nota.findOne({where: {
                alunoId: alunos[i].id,
                avaliação_semestreId: avaliacao.id
            }});

            var resposta = await Avaliação_Resposta.findOne({where: {
                alunoId: alunos[i].id,
                avaliação_semestreId: avaliacao.id
            }});

            alunos[i].resposta = resposta.resposta;

            if (nota) {
                alunos[i].nota = nota.nota;
            } else {
                alunos[i].nota = "";
            }
        }

        res.render('professor-avaliacoes-corrigir', {avaliacao, id, alunos})

    },

    salvarNotaAvaliacao: async function (req,res) {
        var id = req.params.id;
        var sid = req.params.sid;
        var aluno_id = req.body.aluno_id;
        var nota = req.body.nota;

        var avaliação_nota = await Avaliação_Nota.findOne({
            where: {
                alunoId: aluno_id,
                avaliação_semestreId: sid,
            }
        });

        console.log(avaliação_nota);

        if (avaliação_nota) {
            await Avaliação_Nota.update(           
                {   
                    alunoId: aluno_id,
                    avaliação_semestreId: sid,
                    nota: nota 
                },
                { where: 
                    { 
                        alunoId: aluno_id,
                        avaliação_semestreId: sid,
                    }
                } 
            )
        } else {
            await Avaliação_Nota.create({ 
                alunoId: aluno_id,
                avaliação_semestreId: sid,
                nota: nota 
            });
        }


        res.redirect(`/professor/${id}/avaliacoes/corrigir/${sid}`)

    },

    deletarEnvioAvaliacao: async function (req,res) {
        var id = req.params.id;
        var sid = req.params.sid;
        var aluno_id = req.body.aluno_id;

        await Avaliação_Resposta.destroy({
            where: {
                alunoId: aluno_id,
                avaliação_semestreId: sid
            }
        });

        await Avaliação_Nota.destroy({
            where: {
                alunoId: aluno_id,
                avaliação_semestreId: sid
            }
        });

        res.redirect(`/professor/${id}/avaliacoes/corrigir/${sid}`)
        
    }

}