var express = require('express');
var router = express.Router();
var logisModel = require('../model/logistics');
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
    console.log(req.body.data);
    var raw = req.body.data;
    var productCodes = new Array();
    var distinctForm = new Object();

    raw.map ((data) => {
        productCodes.push(data.cellCode);
    })

    //Eliminate Duplicated Value
    var uniqueProductsCodes = Array.from(new Set(productCodes));

    for (var i = 0; uniqueProductsCodes.length; i++) {
        distinctForm.uniqueProductsCodes;
    }
    console.log('ㅁ', distinctForm)

    // Need to Classify Raw Data. 
    // For example, Product Code A001 [cellDnt 1, Qty], [cellDnt 2, Qty], [cellDnt 3, Qty]
    // Product Code A016 [cellDnt 1, Qty], [cellDnt 2, Qty], [cellDnt 3, Qty]
    await logisModel.putSupplyListToDB(raw)
  } catch (err) {
    console.log('aas')
    console.log(err)
  }
})

router.get('/todaySupply', (req, res) => {
  res.render('todaySupply')
})

//todaySupply Page, Search Product From Databaseß Router
router.post('/requestItemList', async (req, res) => {
  try {
    var array = new Array();
    var response = new Array();
    var productList = await logisModel.requestProductList();
    for (let value of productList) {
      array.push([value.code, value.name, value.volume])
    }
    for (var i = 0; i < array.length; i ++) {
      if(array[i][1].indexOf(req.body.searchItem) > -1) {
        response.push(array[i])
      } else {
        continue;
      }
    }
    res.send(response)
  } catch (err) {
    console.log('err')
  }
})

router.get('/todayOrder', (req, res) => {
  res.render('todayOrder')
})

module.exports = router;
