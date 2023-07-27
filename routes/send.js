var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let fromValue 
  if (req.session.login) {
    fromValue = req.session.username
  } else {
    fromValue = "From ( optional )"
  }
  res.render('send',{
    fromValue:fromValue
  });
});

module.exports = router;