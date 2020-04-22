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

router.post('/putSupplyRequestToDB', async (req, res) => {
  try {
    var raw = req.body.data;
    var flags;
    var reObj = new Object();

    
    //Re-Start
    console.log(raw);
    var resResult = await logisModel.checkExistence(raw);
    reObj = {
      dataset : [],
      preset : resResult,
    }
    for (var i = 0; i < raw.length; i++) {
      console.log('#', i)
      if (raw[i].cellDnt == '반품' && resResult[raw[i].cellCode].recall != null) {
        flags = 1;
      } else if (raw[i].cellDnt == '본사' && resResult[raw[i].cellCode].holdings != null) {
        flags = 2;
      } else if (raw[i].cellDnt == '기타' && resResult[raw[i].cellCode].etc != null) {
        flags = 3;
      } else {
        flags = 4;
        reObj.dataset.push(raw[i]);
      }
      console.log(reObj);
    }
    await logisModel.putSupplyListToDB(reObj);
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
    if (raw.itemCode == null) {
      var responseResult = await logisModel.preSuppliedListWithoutItem(raw);
    } else {
      var responseResult = await logisModel.preSuppliedList(raw);
    }
    console.log(responseResult)
    res.send(responseResult)
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
