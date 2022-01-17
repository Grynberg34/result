const Avaliação = require("../models/Avaliação");
const Gabarito = require("../models/Gabarito");

module.exports = {

    criarAvaliacao: async function (req,res) {
        var nome = req.body.nome;
        var nivel = req.body.nivel;
        var tipo = req.body.tipo;
        var texto = req.body.texto;
        var numero = req.body.numero;

        await Avaliação.create({
            nome: nome,
            nivel: nivel,
            tipo: tipo,
            texto: texto,
            numero_perguntas: numero
        }).then(async function (avaliacao) {
            
            if (tipo == "múltipla escolha" || tipo == "completar texto") {
                var value = parseInt(numero) + 1
    
                for (var i = 1; i < value; i++) {
    
                    await Gabarito.create({
                        numero_pergunta: i,
                        resposta: req.body[i],
                        avaliaçãoId: avaliacao.id
                    })
                }
            }
            

        })            
        .catch(function(err){
            res.render('error')
            console.log(err)
        })
        
        res.redirect('/admin/avaliacoes')


    },

    mostrarMenuAvaliacoes: async function (req,res) {

        var niveis = await Avaliação.findAll({group: 'nivel',
        order: [['nivel', 'ASC']]});

        res.render('admin-avaliacoes-niveis', {niveis});
    },

    mostrarAvaliacoesPorNivel: async function (req,res) {
        var id= req.params.id;
        var avaliacoes = await Avaliação.findAll({where: {nivel: id},
        order: [['nome', 'ASC']]})
  
        res.render('admin-avaliacoes-nivel', {avaliacoes, id});
    },

    mostrarAvaliacao: async function (req,res) {
        var id= req.params.sid;
        var avaliacao = await Avaliação.findByPk(id);

        var gabaritos = await Gabarito.findAll({where: {avaliaçãoId: id },
            order: [['numero_pergunta', 'ASC']]
        })
  
        res.render('admin-avaliacoes-avaliacao', {avaliacao, gabaritos});
    },

    mostrarEditorAvaliacao: async function (req,res) {
        var id = req.params.sid;
        var avaliacao = await Avaliação.findByPk(id);

        var gabaritos = await Gabarito.findAll({where: {avaliaçãoId: id },
            order: [['numero_pergunta', 'ASC']]
        })
  
        res.render('admin-avaliacoes-avaliacao-editar', {avaliacao, gabaritos});
    },

    editarAvaliacao: async function (req,res) {
        var id = req.params.sid;
        var texto = req.body.texto;

        Avaliação.update(
            { texto: texto },
            { where: { id: id } }
        )
        .then(function(){
            
            Avaliação.findByPk(id)
            .then(async function(avaliacao){
                if (avaliacao.tipo == "múltipla escolha" || avaliacao.tipo == "completar texto") {

                    var value = parseInt(avaliacao.numero_perguntas) + 1
        
                    for (var i = 1; i < value; i++) {
        
                        await Gabarito.update({
                            resposta: req.body[i],
                            
                        },
                        {where: {avaliaçãoId: id, numero_pergunta: i}})
                    }

                    
                }

                res.redirect(`/admin/avaliacoes/ver/${avaliacao.nivel}/${id}`)
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
    },

    deletarAvaliacao: async function (req,res) {
        var nivel = req.params.id;
        var id = req.body.avaliacao;

        Avaliação.destroy({where: {id: id}}).then(function(){
            res.redirect(`/admin/avaliacoes/ver/${nivel}`);
        })
        .catch(function(err){
            res.render('error')
            console.log(err)
        });
    }

}