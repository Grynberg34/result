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
const puppeteer = require('puppeteer');
import { executablePath } from "puppeteer";

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
        var id = req.params.id;
        var sid = req.params.sid;

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
            include: [Turma, {
                model: Professor,
                include: [User]
            }],
        });

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

            var estatisticas_aulas = {
                presenças: num_presenças,
                aulas: num_aulas,
                percentual: percentual
            }

            var estatisticas_chamadas = [];

            for (var a=0; a < chamadas.length; a++) {

                if (chamadas[a].presença == false) {
                    var presença = 'ausente'
                }

                else if (chamadas[a].presença == true) {
                    var presença = 'presente'
                }


                var dia = chamadas[a].Aula.data.substr(8,2);
                var anohora = chamadas[a].Aula.data.substr(0, 4);
                var mes = chamadas[a].Aula.data.substr(5,2);
                var data = dia + '/' + mes + '/' + anohora;

        
                var chamada = {
                    numero_aula : chamadas[a].Aula.numero_aula,
                    data: data,
                    presença: presença
                }

                estatisticas_chamadas.push(chamada);

            }

            var avaliacoes = await Avaliação_Semestre.findAll({where: {semestreId: semestre.id}});

            var pontos_aluno = 0;

            var pontos_total = 0;

            var estatisticas_avaliacoes = [];

            for (var o=0; o < avaliacoes.length; o++) {

                pontos_total = pontos_total + avaliacoes[o].pontos_total;

                var nota = await Avaliação_Nota.findOne({where:
                {
                    avaliação_semestreId : avaliacoes[o].id,
                    alunoId: alunos[i].id
                },
                include: [{
                    model: Avaliação_Semestre
                }] });

                if (nota) {
                    pontos_aluno = pontos_aluno + nota.nota;

                    var avaliacao = {
                        numero: nota.Avaliação_Semestre.numero,
                        nota: nota.nota,
                        pontos_total: nota.Avaliação_Semestre.pontos_total
                    }
                }

                estatisticas_avaliacoes.push(avaliacao);


            }

            if (pontos_aluno == 0 && pontos_total == 0) {
                var percentual_pontos = 0
            }

            else {
                var percentual_pontos = Math.floor(((pontos_aluno * 100) / pontos_total));
            }

            var estatisticas_pontos = {
                pontos_aluno: pontos_aluno,
                pontos_total: pontos_total,
                percentual: percentual_pontos
            }

            alunos[i].aulas = estatisticas_aulas;
            alunos[i].chamadas = estatisticas_chamadas;
            alunos[i].avaliacoes = estatisticas_avaliacoes;
            alunos[i].pontos = estatisticas_pontos;
            
        }

        res.render('admin-semestres-relatorio', {semestre, alunos, id, sid});

    },
    gerarPDF: async function (req, res) {
        var id = req.params.id;
        var sid = req.params.sid;

        const browser = await puppeteer.launch({ headless: true, executablePath: executablePath(), });
        const page = await browser.newPage();

        await page.goto(`https://result-english.com/login`, {waitUntil: 'networkidle0'});
        await page.type('#email', process.env.ADMIN_EMAIL)
        await page.type('#password', process.env.ADMIN_PASS)
        await page.click('#submit')
        await page.waitForNavigation({ waitUntil: 'networkidle0' }),

        await page.goto(`https://result-english.com/admin/turmas/ver/${id}/semestres/${sid}/relatorio`, {waitUntil: 'networkidle0'});
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();
        

        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf)

    }

}