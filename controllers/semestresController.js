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
const PDFDocument = require('pdfkit');
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

        doc.pipe(fs.createWriteStream(`./public/relatorios/relatorio_${semestre.id}_${pdf_number}.pdf`));

        for (var i=0; i < alunos.length; i++) {

            var aulas = await Aula.findAll({where: {
                semestreId: sid,
                chamada: true
            }});

            var chamadas = [];

            var num_aulas = aulas.length;

            var presenças = [];

            for (var e=0; e < aulas.length; e++) {
                var chamada = await Chamada.findAll({where: {
                    aulaId: aulas[e].id,
                    alunoId: alunos[i].id
                }, 
                include: [Aula]});

                if (chamada[0] && (chamada[0].presença == true)) {
                    presenças.push(chamada[0]);
                }

                if (chamada[0]) {
                    chamadas.push(chamada[0]);
                }
            }

            var num_presenças = presenças.length;

            if (num_presenças == 0 && num_aulas == 0) {
                var percentual = 0
            }

            else {
                var percentual = Math.floor(((num_presenças * 100) / num_aulas));
            }

            if ( i > 0) {
                doc.addPage()
            } 

            doc.image('./public/images/logo.png', 400, 15, {fit: [100, 100], align: 'center', valign: 'center'})
    
            doc
            .fontSize(20)
            .fillColor('#f2780b')
            .text(`${alunos[i].User.nome}`, 100, 30, )
    
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

            for (var a=0; a < chamadas.length; a++) {

                if (chamadas[a].presença == false) {
                    var presença = 'ausente'
                }

                else if (chamadas[a].presença == true) {
                    var presença = 'presente'
                }

                if (a < 8) {
                    var largura = 100
                    var altura = 250 + (a * 25);
                }

                else if (a > 7) {
                    var largura = 400
                    var altura = 250 + ((a-8) * 25);
                }

                var dia = chamadas[a].Aula.data.substr(8,2);
                var anohora = chamadas[a].Aula.data.substr(0, 4);
                var mes = chamadas[a].Aula.data.substr(5,2);
                var data = dia + '/' + mes + '/' + anohora;
        

                doc
                .fontSize(10)
                .text(`Aula ${chamadas[a].Aula.numero_aula} (${data}):  ${presença}`, largura, altura);

            }

            doc.moveTo(0, 470)
            .lineTo(0, 470)
            .lineTo(650, 470)
            .stroke();   

            var avaliacoes = await Avaliação_Semestre.findAll({where: {semestreId: semestre.id}});

            var pontos_aluno = 0;

            var pontos_total = 0;

            for (var o=0; o < avaliacoes.length; o++) {

                pontos_total = pontos_total + avaliacoes[o].pontos_total;

                var nota = await Avaliação_Nota.findOne({where:
                {
                    avaliação_semestreId : avaliacoes[o].id,
                    alunoId: alunos[i].id
                },
                include: [{
                    model: Avaliação_Semestre,
                    include: Avaliação
                }] });


                if (o < 7) {
                    var largura = 100
                    var altura = 570 + (o * 25);
                }

                else if (o > 6) {
                    var largura = 320
                    var altura = 570 + ((o-7) * 25);
                }


                if (nota) {
                    pontos_aluno = pontos_aluno + nota.nota;
                    doc
                    .fontSize(10)
                    .text(`Avaliação ${nota.Avaliação_Semestre.numero} (${nota.Avaliação_Semestre.Avaliação.tipo}): ${nota.nota}/${nota.Avaliação_Semestre.pontos_total} `, largura, altura);
                }

            }

            if (pontos_aluno == 0 && pontos_total == 0) {
                var percentual_pontos = 0
            }

            else {
                var percentual_pontos = Math.floor(((pontos_aluno * 100) / pontos_total));
            }

            doc
            .fontSize(14)
            .fillColor('#000000')
            .text(`Pontos: ${pontos_aluno}/${pontos_total} (${percentual_pontos}%)`, 100, 520, {align: 'center'});
            
        }



        doc.end();

        setTimeout(function(){ res.redirect(`/relatorios/relatorio_${semestre.id}_${pdf_number}.pdf`);}, 4000);   
    },

}