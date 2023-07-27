var express = require('express');
var router = express.Router();
const mysql = require('mysql');

let Connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'sendme'
})
/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.login) {
    Connection.query(`select * from ${req.session.username}`,function(error,result,fields){
      // messages = result
      messages = JSON.parse(JSON.stringify(result))
      MessagesTable = ''
      console.log(messages) 
      for (let i = 0; i < messages.length; i++) {
        message = `<tr>
                      <td>${messages[i].name}</td>
                      <td>${messages[i].message}</td>
                  </tr>`
        MessagesTable += message
      }
      res.render(
        'index', 
        { title: `SendMe | ${req.session.username}`,
          username: `${req.session.username}`,
          MT:MessagesTable
        });
    })  
  } else {
    res.redirect('/log-in')
  }
});

module.exports = router;