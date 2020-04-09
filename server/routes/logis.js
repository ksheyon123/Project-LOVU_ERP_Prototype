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

router.get('/logisManagement', (req, res) => {
  res.render('logisManagement')
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

router.get('/getLogisManagement', async (req, res) => {
  try {
    console.log('hi')
    res.send('a');
  } catch (err) {
    console.log(err)
  }
})


module.exports = router;
