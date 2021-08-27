const Material = require("../models/Material");

const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/materiais/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  dest: 'public/materiais/',
  storage: storage
})

module.exports = {

    mostrarMenuMateriais: async function (req,res) {
      var niveis = await Material.findAll({group: 'nivel',
      order: [['nivel', 'ASC']]});

      res.render('admin-materiais', {niveis});
    },

    mostrarMateriaisPorNivel: async function (req,res) {
      var id= req.params.id;
      var materiais = await Material.findAll({where: {nivel: id},
      order: [['nome', 'ASC']]})

      res.render('admin-materiais-nivel', {materiais, id});
    },

    adicionarPastaMaterial: upload.single('zip'),

    adicionarMaterial: async function (req,res) {
      var nome = req.body.nome;
      var nivel = req.body.nivel;
      var link = `/materiais/${req.file.filename}`;

      await Material.create({
        nome: nome,
        nivel: nivel,
        link: link
      })

      res.redirect('/admin/materiais');
    },

    removerMaterial: async function (req,res) {
      var material = req.body.material;
      var id = req.params.id;

      Material.destroy({where: {id : material}})
      .then(function(){
        res.redirect(`/admin/materiais/nivel/${id}`);
      })
      .catch(function(err){
        res.render('error')
        console.log(err)
    });
    }

}