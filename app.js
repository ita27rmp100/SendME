var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const qs = require('querystring');
const mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var SignUP_Router = require('./routes/sign-up');
var LogIN_Router = require('./routes/log-in');
var SendTo = require('./routes/send');
const { ppid } = require('process');

var app = express();

// Connection with database
let Connection = mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'',
  database:'sendme'
})
var usersList = {}, usernames , passowrds 
function gettingUsers(){
  Connection.query('select * from users',function(error,results,fields) {
  console.log("connected succefully");
  usernames = results.map(row => row.username)
  passowrds = results.map(row => row.password)
  console.log(usernames,passowrds)
  for(i=0;i<(Object.keys(usernames).length);i++){
    usersList[usernames[i]]=passowrds[i]
  }
  console.log(usersList)
})
}
gettingUsers()
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
      gettingUsers()
      if (result.password==result.ConfirmPassword && !(result.username in usersList)) {
        Connection.query(`insert into users(username, password) value('${result.username}','${result.password}')`)
        Connection.query(`create table ${result.username}(date varchar(11),message varchar(1000))`)
        req.session.login = true
        req.session.username = result.username
        res.redirect('/')
        gettingUsers()
      }
      else{
        if(result.username in usersList){
          res.status(400).send('Something happend wrong , you may wanted to sign up with a taken username')
        }
        else if(result.password!=result.ConfirmPassword){
          res.redirect('/sign-up')
        }
      }
  })
})
  // log in
app.post('/log-in',(req,res)=>{
  gettingUsers()
  let body = '' , password
  req.on('data',(data)=>{
    body = body + data
  })
  req.on('end',()=>{
    let result = qs.parse(body) , errorOrder = 'try log-in into this website again please .'
    console.log(result.username,'\n',result.password)
    console.log(result.username in usersList)
    console.log(result.password == usersList[result.username])
    if(result.username in usersList){
      if(result.password == usersList[result.username]){
        console.log('log in succefully !')
        req.session.login = true
        req.session.username = result.username
        res.redirect('/')
      }else{
        res.status(400).send('Your password is incorrect , ' + errorOrder);
      }
    }
    else{
      res.status(400).send('Your password is incorrect , ' + errorOrder);
    }
  }
  )
})
  // log out
app.post('/',(req,res)=>{
  req.session.login = false
  res.redirect('/log-in')
})
  // Send Message
app.post('/send',(req,res)=>{
  let body = ''
  req.on('data',(data)=>{
    body += data
  })
  req.on('end',()=>{
    let result = qs.parse(body)
    let date = new Date()
    let dateSend = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
    console.log(result)
    console.log(result.to)
    console.log(result.message)
    console.log(dateSend)
    Connection.query(`insert into ${result.to}() value('${dateSend}','${result.message}')`,function(err,queryResult,fields) {
      try {
        res.redirect('/')
      } catch (error) {
        res.status(400)
      }
    })
  })
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
app.use('/log-in',LogIN_Router);
app.use('/send',SendTo)
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

// module.exports = messege
module.exports = app;