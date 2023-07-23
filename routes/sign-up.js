var express = require('express');
var router = express.Router();

/* GET sign-up page. */
router.get('/', function(req, res, next) {
  if (!req.session.login) {
    res.render('sign-up')
  } else {
    res.redirect('/')
  }
});

module.exports = router;