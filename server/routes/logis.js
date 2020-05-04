var express = require('express');
var router = express.Router();
var logisModel = require('../model/logistics');
/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/main', (req, res) => {
  res.render('main')
});

//Render requestLogis Page
router.get('/requestLogis', (req, res) => {
  res.render('requestLogis')
});

router.post('/putRequestLogisToDB', async (req, res) => {
  try {
    var raw = req.body.data;
    console.log(raw)
    await logisModel.putRequestListToDB(raw)
    res.send({result : 1})
  } catch (err) {
    console.log(err)
  }
});

//Insert Supply Item List to Database
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

//Insert Order Item List to Database
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

//todaySupply, todayOrder, requestLogis Page, Search Product From Database Router
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

//Render todayOrder Page
router.get('/todayOrder', (req, res) => {
  res.render('todayOrder')
});

//Get Pre-Ordered Item List From Database
router.post('/requestPreOrderedList', async (req, res) => {
  try {
    var raw = req.body;
    console.log('order raw', raw)
    if (raw.itemCode == null) {
      var responseResult = await logisModel.preOrderedListWithoutItem(raw);
    } else {
      var responseResult = await logisModel.preOrderedList(raw);
    }
    res.send(responseResult)
  } catch (err) {
    console.log(err)
  }
});

//Get Pre-Supplied Item List From Database
router.post('/requestPreSuppliedList', async (req, res) => {
  try {
    var raw = req.body;
    if (raw.itemCode == null) {
      var responseResult = await logisModel.preSuppliedListWithoutItem(raw);
    } else {
      var responseResult = await logisModel.preSuppliedList(raw);
    }
    res.send(responseResult)
  } catch (err) {
    console.log(err)
  }
});

//Render Overlack Page
router.get('/overlack', (req, res) => {
  res.render('overlack');
});

//Insert Over-Lack Item List to Database
router.post('/putOverlackRequestToDB', async (req, res) => {
  try {
    var raw = req.body.data;
    var resResult = await logisModel.checkExistenceOverlack(raw);
    await logisModel.putOverlackListToDB(resResult);
    res.send('성공')
  } catch (err) {
    console.log(err)
  }
});

//Render inventoryManagement Page
router.get('/inventoryManagement', (req, res) => {
  res.render('inventoryManagement')
});

//Render periodSum Page
router.get('/periodSum', (req, res) => {
  res.render('periodSum')
});

//Get Enrolled Item List based on Period From Database
router.post('/getPeriodData', async (req, res) => {
  try {
    var rawObj = new Object();
    var rawArr = new Array();
    // Get All Items List
    var productList = await logisModel.requestProductList();

    for (var i = 0; i < productList.length; i++) {
      rawObj = {
        itemCode: productList[i].code,
        itemName: productList[i].name,
        itemVolume: productList[i].volume,
        qty: {
          prestocks : 0,
          recall: 0,
          holdings1: 0,
          etc1: 0,
          sell: 0,
          holdings2: 0,
          etc2: 0,
          over: 0,
          lack: 0,
        }
      }
      rawArr.push(rawObj)
    }
    dataSet = {
      ddata: req.body,
      raw: rawArr,
    }
    var putAllQty = await logisModel.sumEnrolledQty(dataSet);
    dataSet.raw = putAllQty;
    var allResult = await logisModel.getEnrolledOverlackQty(dataSet)
    res.send(allResult);

  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
