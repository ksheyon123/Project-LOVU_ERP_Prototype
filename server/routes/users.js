var express = require('express');
var router = express.Router();
var authModel = require('../model/auths');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/auth', async (req, res) => {
  try {
    var resObj = new Object();
    var resResult = await authModel.login(req.body);
    switch (parseInt(resResult)) {
      case 0:
        resObj = {
          status: 0,
        }
        break;
      case 1:
        resObj = {
          status: 1,
        }
        req.session.user = {
          user: req.body.userId,
          password: req.body.userPw
        }
        break;
    }
    res.status(200).send(resObj)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
