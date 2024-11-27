var express = require('express');
var router = express.Router();
const mysql = require('mysql');

let Connection = mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'',
  database:'sendme'
})
/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.login) {
    console.log(req.session.username)
    Connection.query(`select * from ${req.session.username}`,function(error,result,fields){
      messages = result
      // messages = JSON.parse(JSON.stringify(result))
      MessagesTable = ''
      try {
        for (let i = 0; i <(Object.keys(messages).length); i++) {
          message = `<div class="message px-2 py-1">
                        <b class='elem-date'>${messages[i].date}</b>
                        <p class='elem-msg'>${messages[i].message}</p>
                    </div>`
          MessagesTable += message
        }
      } catch (error) {
        MessagesTable = ''
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