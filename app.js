var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const qs = require('querystring');
const mysql = require('mysql');
const alert = require('alert-node');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var SignUP_Router = require('./routes/sign-up');
var LogIN_Router = require('./routes/log-in')

var app = express();

// Connection with database
let Connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'sendme'
})
var usersList , messege
Connection.query('select email from users',function(error,results,fields) {
  usersList = results.map(row => row.email);
  console.log(usersList)
})
// sessions 
  // Set up session middleware
app.use(session({
  secret: "it's secret"
}));
// post forms 
  // sign up
app.post('/sign-up',(req,res)=>{
  let body = ''
  req.on('data',(data)=>{
      body = body + data
  })
  req.on('end',()=>{
      let result = qs.parse(body)
      if (result.password==result.ConfirmPassword && !(usersList.includes(result.username))) {
        Connection.query(`insert into users()values('${result.username}','${result.password}')`)
        Connection.query(`create table ${result.username}(name varchar(50) primary key , message varchar(1000))`)
        req.session.login = true
        req.session.username = result.username
        res.redirect('/')
      }
      else if(usersList.includes(result.username)){
        res.status(400).send('Something happend wrong , you may wanted to sign up with a taken username')
      }
      else if(result.password!=result.ConfirmPassword){
        res.redirect('/sign-up')
      }
  })
})
  // log in
app.post('/log-in',(req,res)=>{
  let body = '' , password
  req.on('data',(data)=>{
    body = body + data
  })
  req.on('end',()=>{
    let result = qs.parse(body) , errorOrder = 'try log-in into this website again please .'
    if (usersList.includes(result.username)){
      Connection.query(`select password from users where email = '${result.username}'`,function(error,queryResult,fields) {
        password = queryResult[0].password
        if (result.password==password) {
          req.session.login = true
          req.session.username = result.username
          res.redirect('/')
        } else {
          res.status(400).send('Your password is incorrect , ' + errorOrder);
        }
      })
    }
    else {
      res.status(400).send("this username doesn't exist , " + errorOrder);
    }
  }
    // console.log(password)
  )
})
// static pages 
app.use(express.static('public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',indexRouter);
app.use('/users',usersRouter);
app.use('/sign-up',SignUP_Router);
app.use('/log-in',LogIN_Router)
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

module.exports = messege
module.exports = app;
