var express = require('express');
var router = express.Router();

/* GET sign-up page. */
router.get('/', function(req, res, next) {
  const login = req.session.login;
  if (!req.session.login || !login) {
    res.render('log-in')
  } else {
    res.redirect('/')
  }
});

module.exports = router;