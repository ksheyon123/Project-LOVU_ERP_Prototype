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
    var raw = req.body.data;
    // Need to Classify Raw Data. 
    // For example, Product Code A001 [cellDnt 1, Qty], [cellDnt 2, Qty], [cellDnt 3, Qty]
    // Product Code A016 [cellDnt 1, Qty], [cellDnt 2, Qty], [cellDnt 3, Qty]
    var afterPutData = await logisModel.putSupplyListToDB(raw);
    console.log('afterPutData', afterPutData)
    res.send({response : afterPutData});
  } catch (err) {
    console.log('aas')
    console.log(err)
  }
});

router.post('/putOrderRequestToDB', async (req, res) => {
  try {
    var raw = req.body.data;
    var afterPutData = await logisModel.putOrderListToDB(raw);
  } catch (err) {

  }
})

router.get('/todaySupply', (req, res) => {
  res.render('todaySupply')
})

//todaySupply Page, Search Product From Databaseß Router
router.post('/requestItemList', async (req, res) => {
  try {
    console.log(req.body)
    var array = new Array();
    var response = new Array();
    var productList = await logisModel.requestProductList();
    for (let value of productList) {
      array.push([value.code, value.name, value.volume])
    }
    for (var i = 0; i < array.length; i++) {
      if (array[i][1].indexOf(req.body.searchItem) > -1) {
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
});

router.post('/requestPreSuppliedList', async (req, res) => {
  try { 
    var raw = req.body;
    console.log(raw)
    if (raw.itemCode == null) {
      var responseResult = await logisModel.preSuppliedListWithoutItem(raw);

    } else if (raw.startYear == null) {
      var responseResult = await logisModel.preSuppliedListWithoutPeriod(raw);

    } else {
      var responseResult = await logisModel.preSuppliedList(raw);

    }

    console.log(responseResult)
  } catch (err) {
    console.log(err)
  }
});

router.get('/overlack', (req, res) => {
  res.render('overlack');
});

router.get('/inventoryManagement', (req, res) => {
  res.render('inventoryManagement')
})

module.exports = router;
