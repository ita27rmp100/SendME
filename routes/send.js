var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:to?', function(req, res, next) {
  res.render('send',{
    toValue:req.params.to ,
    logIN:req.session.login
  })
});

module.exports = router;