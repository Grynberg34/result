const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const connection = require('./config/database');
const User = require('./models/User');
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const indexRouter = require('./routes/index');
const cadastroRouter = require('./routes/cadastro');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const redefinirRouter = require('./routes/redefinir');
const alunoRouter = require('./routes/aluno');
const professorRouter = require('./routes/professor');
const adminRouter = require('./routes/admin');

const app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Express configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => { 
  if ((req.headers["x-forwarded-proto"] || "").endsWith("http"))
  res.redirect(`https://${req.hostname}${req.url}`);
  else
  next();
});

//Cookie store
var sessionStore = new SequelizeStore({
  db: connection,
});

//Passport configs
app.use(session({
  key: 'session_cookie_name',
  secret: 'englishtest',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie : {
    maxAge: 1000* 60 * 60 *24 * 365
  },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function(user, done) {
  done(null, {
    id     : user.id,
    tipo_conta : user.tipo_conta,
  });
});

passport.deserializeUser((user, done) => {
  User.findByPk(user.id).then((user) => {
    done(null, user);
  }).catch(done);
});

// Local Strategy
passport.use('users', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true,
},
function(req, email, password, done) {
  console.log('Teste')
  User.findOne({
    where: {
      email: email
    }
  }).then(function(user) {
    if (user == null) {
      
      return done(null, false, req.flash('message', 'Email inválido.'));
    }

    bcrypt.compare(password, user.password, function(err, isMatch) {
      if(err)
        return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, req.flash('message', 'Senha inválida.'));
      }
    });


  })
}));


//Routes
app.use('/', indexRouter);
app.use('/cadastro', cadastroRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/redefinir', redefinirRouter);
app.use('/aluno', alunoRouter);
app.use('/professor', professorRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Listen to port 3000
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Listening on port', port);
});

module.exports = app;
