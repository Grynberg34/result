const Avaliação = require("../models/Avaliação");
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
    bucket: 'grynberg34' + '/Trabalhos/Result-Avaliacoes/Avaliacoes',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
}).array('files', 2);

module.exports = {

  adicionarAvaliação: function (req,res,next){

    upload(req, res, function (error) {
      if (error) {
        console.log('error')
        console.log(error);
        return res.render('error');
      }
      console.log('File uploaded successfully.');
      next();
    });

  },

  criarAvaliacao: async function (req,res) {
    var nome = req.body.nome;
    var nivel = req.body.nivel;
    var tipo = req.body.tipo;
    var coleção = req.body.coleção;

    await Avaliação.create({
      nome: nome,
      nivel: nivel,
      tipo: tipo,
      coleção: coleção,
      link: 'https://grynberg34.nyc3.digitaloceanspaces.com/Trabalhos/Result-Avaliacoes/Avaliacoes/' + req.files[0].originalname,
      gabarito: 'https://grynberg34.nyc3.digitaloceanspaces.com/Trabalhos/Result-Avaliacoes/Avaliacoes/' + req.files[1].originalname
    })
    .then(function(){
      res.redirect('/admin/avaliacoes')
    })          
    .catch(function(err){
      console.log(err)
      return res.render('error')
    });

  },

  mostrarMenuAvaliacoes: async function (req,res) {

    var niveis = await Avaliação.findAll({group: 'nivel',
    order: [['nivel', 'ASC']]});

    res.render('admin-avaliacoes-niveis', {niveis});
  },

  mostrarColecoes: async function (req,res) {
    var id = req.params.id;

    var coleções = await Avaliação.findAll({
    where: {
      nivel: id
    },
    group: 'coleção',
    order: [['coleção', 'ASC']]});

    res.render('admin-avaliacoes-colecoes', {coleções});
  },

  mostrarAvaliacoesColecao: async function (req,res) {
    var id= req.params.id;
    var cid = req.params.cid;

    var avaliacoes = await Avaliação.findAll({where: {
      nivel: id,
      coleção: cid
    },
    order: [['nome', 'ASC']]})

    res.render('admin-avaliacoes-nivel', {avaliacoes, id, cid});
  },

  mostrarAvaliacao: async function (req,res) {
    var id= req.params.sid;
    var avaliacao = await Avaliação.findByPk(id);

    res.render('admin-avaliacoes-avaliacao', {avaliacao});
  },

  mostrarEditorAvaliacao: async function (req,res) {
    var id = req.params.sid;
    var avaliacao = await Avaliação.findByPk(id);

    res.render('admin-avaliacoes-avaliacao-editar', {avaliacao});
  },

  editarAvaliacao: async function (req,res) {
    var id = req.params.sid;
    var nivel = req.params.id;
    var coleção = req.params.cid;
    var nome = req.body.nome;
    var coleção = req.body.coleção;  

    Avaliação.update(
      { nome: nome,
        coleção: coleção 
      },
      { where: { id: id } }
    )
    .then(function(){
      res.redirect(`/admin/avaliacoes/ver/${nivel}/${coleção}/${id}`)
    })
    .catch(function(err){
      console.log(err)
      return res.render('error')
    });

  },

  deletarAvaliacao: async function (req,res) {
    var nivel = req.params.id;
    var coleção = req.params.cid;
    var id = req.body.avaliacao;

    Avaliação.destroy({where: {id: id}}).then(function(){
      res.redirect(`/admin/avaliacoes/ver/${nivel}/${coleção}`);
    })
    .catch(function(err){
      console.log(err)
      return res.render('error')
    });
  }

}