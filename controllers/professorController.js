const Professor = require("../models/Professor");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const Aula = require("../models/Aula");
const Aluno = require("../models/Aluno");
const User = require("../models/User");
const Chamada = require("../models/Chamada");
const Material = require("../models/Material");
const Avaliação = require("../models/Avaliação");
const Avaliação_Semestre = require("../models/Avaliação_Semestre");
const PDFDocument = require('pdfkit');


module.exports = {

    mostrarTurmasProfessor: async function (req,res) {
        var user_id = req.user.id;

        Professor.findOne({where: { userId: user_id} })
        .then(async function(professor) {
            var semestres = await Semestre.findAll({where: {professorId: professor.id, concluido: false },
                include: [Turma],
            });
            res.render('professor', {semestres})

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
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

            aulas[i].chamadas = chamadas;

        }




        res.render('professor-turma-aulas', {aulas, id})

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

        Aula.update(           
            {   
                comentarios: comentarios, 
                tema: tema
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
                include: [User]})
    
                res.render('professor-turma-aulas-chamada', {alunos});
            
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

    mostrarMaterial: async function (req,res) {
        var id = req.params.id;

        Semestre.findByPk(id).then(async function (semestre) {

            var materiais = await Material.findAll({where: {nivel: semestre.nivel},
                order: [['nome', 'ASC']]})

            res.render('professor-materiais', {materiais, id})

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
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

                chamadas.push(chamada[0])
            }

            var num_presenças = presenças.length;

            var percentual = Math.floor(((num_presenças * 100) / num_aulas));


            res.render('professor-alunos-aluno', {aluno, semestre, id, chamadas, num_aulas, num_presenças, percentual});
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })

    },

    gerarRelatorioAluno: async function (req,res) {
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
        }})
        .then(async function(aulas) {

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

                if (chamada[0]) {
                    chamadas.push(chamada[0])
                }
            }

            var num_presenças = presenças.length;

            var percentual = Math.floor(((num_presenças * 100) / num_aulas));
        
            const doc = new PDFDocument();

            doc.image('./public/images/logo.png', 400, 15, {fit: [100, 100], align: 'center', valign: 'center'})
    
            doc
            .fontSize(20)
            .fillColor('#f2780b')
            .text(`${aluno.User.nome}`, 100, 30, )
    
            doc
            .fontSize(10)
            .text(`Turma: ${semestre.Turma.nome}`, 100, 60);
    
            doc
            .fontSize(10)
            .text(`Semestre: ${semestre.data}`, 100, 80);

            doc
            .fontSize(10)
            .text(`Nível: ${semestre.nivel}`, 100, 100);

            doc.moveTo(0, 150)
            .lineTo(0, 150)
            .lineTo(650, 150)
            .stroke();               

            doc
            .fontSize(14)
            .fillColor('#000000')
            .text(`Presenças: ${num_presenças}/${num_aulas}  (${percentual}%)`, 100, 200, {align: 'center'})

            for (var i=0; i < chamadas.length; i++) {

                if (chamadas[i].presença == false) {
                    var presença = 'ausente'
                }

                else if (chamadas[i].presença == true) {
                    var presença = 'presente'
                }

                if (i < 8) {
                    var largura = 100
                    var altura = 250 + (i * 25);
                }

                else if (i > 7) {
                    var largura = 400
                    var altura = 250 + ((i-8) * 25);
                }

                var dia = chamadas[i].Aula.data.substr(8,2);
                var anohora = chamadas[i].Aula.data.substr(0, 4);
                var mes = chamadas[i].Aula.data.substr(5,2);
                var data = dia + '/' + mes + '/' + anohora;
        

                doc
                .fontSize(10)
                .text(`Aula ${chamadas[i].Aula.numero_aula} (${data}):  ${presença}`, largura, altura);


            }

            doc.moveTo(0, 470)
            .lineTo(0, 470)
            .lineTo(650, 470)
            .stroke();   
        
    
            doc.pipe(res); 
    
            doc.end();

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
                },  include: [Avaliação]
            });

            res.render('professor-avaliacoes', {id, avaliacoes})
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })


    },

    abrirFecharAvaliacao: async function (req,res) {
        var id = req.params.id;
        var a_id = req.body.a_id;

        console

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

    mostrarFormularioAvaliacoes: async function (req,res) {
        var id = req.params.id;

        Semestre.findByPk(id).then(async function(semestre){
            
            var avaliacoes = await Avaliação.findAll({where: {
                nivel: semestre.nivel
            }});

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

            if (avaliacao.tipo == 'perguntas abertas') {
                var corrigido = false;
            }
            
            else{
                var corrigido = true;
            }

            var pontos_total = pontos * avaliacao.numero_perguntas;

            var numero_anterior = await Avaliação_Semestre.findAll({where: {
                semestreId: id
            }})

            var numero_final = numero_anterior.length + 1;

            Avaliação_Semestre.create({
                numero: numero_final,
                pontos_pergunta: pontos,
                pontos_total: pontos_total,
                corrigido: corrigido,
                semestreId: id,
                avaliaçãoId: avaliacao.id
            })

            res.redirect(`/professor/${id}/avaliacoes`)

        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        })


    }

}