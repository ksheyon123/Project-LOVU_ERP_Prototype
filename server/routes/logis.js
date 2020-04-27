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
    var resResult = await logisModel.checkExistenceSupply(raw);
    reObj = {
      dataset: [],
      preset: resResult,
    }
    for (var i = 0; i < raw.length; i++) {
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
    }
    if (reObj.dataset[0]) {
      await logisModel.putSupplyListToDB(reObj);
    }
    res.send('성공')
  } catch (err) {
    console.log(err)
  }
});

router.post('/putOrderRequestToDB', async (req, res) => {
  try {
    var raw = req.body.data;
    var flags;
    var reObj = new Object();
    //Re-Start
    var resResult = await logisModel.checkExistenceOrder(raw);
    reObj = {
      dataset: [],
      preset: resResult,
    }
    for (var i = 0; i < raw.length; i++) {
      if (raw[i].cellDnt == '판매' && resResult[raw[i].cellCode].recall != null) {
        flags = 1;
      } else if (raw[i].cellDnt == '본사' && resResult[raw[i].cellCode].holdings != null) {
        flags = 2;
      } else if (raw[i].cellDnt == '기타' && resResult[raw[i].cellCode].etc != null) {
        flags = 3;
      } else {
        flags = 4;
        reObj.dataset.push(raw[i]);
      }
    }
    if (reObj.dataset[0]) {
      await logisModel.putOrderListToDB(reObj);
    }
    res.send('성공')
  } catch (err) {
    console.log(err)
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

router.post('/requestPreOrderedList', async (req, res) => {
  try {
    var raw = req.body;
    console.log('order raw', raw)
    if (raw.itemCode == null) {
      var responseResult = await logisModel.preOrderedListWithoutItem(raw);
    } else {
      var responseResult = await logisModel.preOrderedList(raw);
    }
    console.log(responseResult)
    res.send(responseResult)
  } catch (err) {
    console.log(err)
  }
})

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

router.post('/putOverlackRequestToDB', async (req, res) => {
  try{
    var raw = req.body.data;
    var resResult = await logisModel.checkExistenceOverlack(raw);
    await logisModel.putOverlackListToDB(resResult);
    res.send('성공')
  } catch (err) {
    console.log(err)
  }
});

router.get('/inventoryManagement', (req, res) => {
  res.render('inventoryManagement')
});

router.get('/periodSum', (req, res) => {
  res.render('periodSum')
});

router.get('/getPeriodData', async (req, res) => {
  try {
    
    // Get All Items List
    var productList = await logisModel.requestProductList();
    console.log(productList)
    // Get Date Data (7 Days Ago - Today )
    for (var i  = 0; i < productList.length; i++) {

    }
    await logisModel.sumEnrolledQty();
    //

    obj = {
      itemCode : null,
      itemName : null,
      recall : null,
      holdings1 : null,
      etc1 : null,
      sell : null,
      holdings2 : null,
      etc2 : null

    }
  } catch (err) {
    console.log(err)
  }
})

module.exports = router;
