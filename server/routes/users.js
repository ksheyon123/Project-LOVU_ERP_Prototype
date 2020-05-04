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
    switch (resResult) {
      case 0 :
      resObj = {
        status : 0,
        content : {
          txt : '아이디 혹은 비밀번호를 확인해주세요'
        }
      }
      case 1 : 
      resObj = {
        status : 1,
        content : {
          txt : '로그인 되었습니다'
        }
      }
    }
    res.status(200).send(resObj)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
