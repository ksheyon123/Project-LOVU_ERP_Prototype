var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/auth', async (req, res) => {
  try {
    console.log(req.body)
    if (req.body.userId == 'admin' && req.body.userPw == 'admin') {
      res.render('main')
    } else {
      res.redirect('/')
    }
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
