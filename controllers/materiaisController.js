const Material = require("../models/Material");

const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'FKRSQNNKJW26VGVS25BI',
  secretAccessKey: 'QTKl3LHzw6+Nk9q0uP4272oirY7irocmQn/VHmGdnA8',
  region: 'nyc3'
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'grynberg34' + '/Trabalhos/Result-Materiais',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
}).array('zip', 1);

module.exports = {

    mostrarMenuMateriais: async function (req,res) {
      var niveis = await Material.findAll({group: 'nivel',
      order: [['nivel', 'ASC']]});

      res.render('admin-materiais', {niveis});
    },

    mostrarColecoes: async function (req,res) {
      var id = req.params.id;
  
      var coleções = await Material.findAll({
      where: {
        nivel: id
      },
      group: 'coleção',
      order: [['coleção', 'ASC']]});
  
      res.render('admin-materiais-colecoes', {coleções});
    },
  

    mostrarMateriaisPorColecao: async function (req,res) {
      var id= req.params.id;
      var sid = req.params.sid;
      var materiais = await Material.findAll({where: {nivel: id, coleção: sid},
      order: [['nome', 'ASC']]});

      res.render('admin-materiais-lista', {materiais, id, sid});
    },

    adicionarPastaMaterial: function (req,res,next){

      upload(req, res, function (error) {
        if (error) {
          console.log(error);
          return res.render('error');
        }
        console.log('File uploaded successfully.');
        next();
      });

    },

    adicionarMaterial: async function (req, res) {
      var nome = req.body.nome;
      var nivel = req.body.nivel;
      var coleção = req.body.coleção;

      await Material.create({
        nome: nome,
        nivel: nivel,
        coleção: coleção,
        link: 'https://grynberg34.nyc3.digitaloceanspaces.com/Trabalhos/Result-Materiais/' + req.files[0].originalname,
      })
      .catch(function(err){
        console.log(err)
      });

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