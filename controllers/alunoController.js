const Aluno = require("../models/Aluno");
const Professor = require("../models/Professor");
const Semestre = require("../models/Semestre");
const Turma = require("../models/Turma");
const User = require("../models/User");


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
    }    
}