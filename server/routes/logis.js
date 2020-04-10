var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

//Logistic
router.get('/requestLogis', (req, res) => {
  res.render('requestLogis')
});

router.post('/putRequestToDB', async (req, res) => {
  try {
    console.log(req.body)
    res.send('hi')
  } catch (err) {
    console.log('aas')
    console.log(err)
  }
})

router.get('/todaySupply', (req, res) => {
  res.render('todaySupply')
})

router.post('/requestItemList', async (req, res) => {
  try {
    console.log(req.body)
    itemList = [
      'GNB 화이트닝 펩타 미스트',
      'GNB 더 퍼스트 프리미엄 앰플',
      'GNB PRO6 프리미엄 마사지 크림',
      '닥터힐럭스 하이드라리차지 스킨',
      '닥터힐럭스 리바이탈라이즈 세럼',
      '닥터힐럭스 리뉴얼콤플렉스 크림',
      '닥터힐럭스 화이트 폼클렌징',
      '닥터힐럭스 5.8 마일드 클렌저',
    ]
    res.send(itemList)
  } catch (err) {
    console.log('err')
  }
})

router.get('/todayOrder', (req, res) => {
  res.render('todayOrder')
})

module.exports = router;
