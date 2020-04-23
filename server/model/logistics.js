var logisConnection = require('../dbConfig');


class Product {
    requestProductList() {
        return new Promise(
            async (resolve, reject) => {
                try {
                    const sql = 'SELECT * FROM items';
                    var result = await logisConnection.query(sql);
                    resolve(result[0]);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    checkExistenceSupply (raw) {
        return new Promise (
            async (resolve, reject) => {
                var productCodes = new Array();
                var resArray = new Array();
                raw.map((data) => {
                    productCodes.push(data.cellCode);
                })

                // Eliminate Duplicated Value
                var uniqueProductsCodes = Array.from(new Set(productCodes));
                var objComponent = new Object();

                uniqueProductsCodes.map((data) => {
                    objComponent[data] = {
                        recall : null,
                        holdings : null,
                        etc : null,
                    }
                })
                try {
                    for ( var i = 0; i < raw.length; i++) {
                        var sql = 'SELECT suprecallid, supholdingsid, supetcid FROM supplies WHERE distinctid IN (SELECT distinctid FROM supplyinqueries WHERE date = ? AND itemid = ?)';
                        var resResult = await logisConnection.query(sql, [raw[i].date, raw[i].cellCode]);
                        for (var j = 0; j < resResult[0].length; j++) {
                            if (resResult[0][j].suprecallid) {
                                objComponent[raw[i].cellCode].recall = resResult[0][j].suprecallid;
                            } 
                            
                            if (resResult[0][j].supholdingsid) {
                                objComponent[raw[i].cellCode].holdings = resResult[0][j].supholdingsid;
                            } 
                            
                            if (resResult[0][j].supetcid) {
                                objComponent[raw[i].cellCode].etc = resResult[0][j].supetcid;
                            } 
                        }
                    }
                    resolve(objComponent);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    putSupplyListToDB(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var uniqueProductsCodes = Object.keys(data.preset);
                    var raw = data.dataset;
                    
                    var groupObj = new Object();

                    uniqueProductsCodes.map((data) => {
                        groupObj[data] = {
                            recall : null,
                            holdings : null,
                            etc : null,
                        }
                    })
                    
                    for (var x = 0; x < uniqueProductsCodes.length; x++) {
                        console.log(uniqueProductsCodes[x])
                        for (var i = 0; i < raw.length; i++) {

                            if (uniqueProductsCodes[x] == raw[i].cellCode) {
                                // Get Recall Data From Recall Table 
                                if (raw[i].cellDnt == '반품') {
                                    var recallResponse = await logisConnection.query('SELECT * FROM supplyrecalls')
                                    if (recallResponse[0][0] == undefined) {
                                        var recallid = 'R1';
                                    } else {
                                        var num = parseInt(recallResponse[0].length) + 1;
                                        var recallid = 'R' + num;
                                    }

                                    await logisConnection.query('INSERT INTO supplyrecalls (suprecallid, qty) VALUES (?, ?)', [recallid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].recall = recallid;

                                    // Get Holdings Data From Holdings Table 
                                } else if (raw[i].cellDnt == '본사') {
                                    var holdingsResponse = await logisConnection.query('SELECT * FROM supplyholdings')
                                    if (holdingsResponse[0][0] == undefined) {
                                        var holdingsid = 'H1';
                                    } else {
                                        var num = parseInt(holdingsResponse[0].length) + 1;
                                        var holdingsid = 'H' + num;
                                    }

                                    await logisConnection.query('INSERT INTO supplyholdings (supholdingsid, qty) VALUES (?, ?)', [holdingsid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].holdings = holdingsid;


                                    // Get ETC Data From ETC Table
                                } else {
                                    var etcResponse = await logisConnection.query('SELECT * FROM supplyetc')
                                    if (etcResponse[0][0] == undefined) {
                                        var etcid = 'E1';
                                    } else {
                                        var num = parseInt(etcResponse[0].length) + 1;
                                        var etcid = 'E' + num;
                                    }
                                    await logisConnection.query('INSERT INTO supplyetc (supetcid, qty) VALUES (?, ?)', [etcid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].etc = etcid;
                                }
                            }
                        }
                    }
                    for (var i = 0; i <uniqueProductsCodes.length; i++) {
                        var distinctResponse = await logisConnection.query('SELECT * FROM supplies');
                        // DNT Initial, DNT Number Existence Check
                        // If there is no Initial DNT, then go to "if(distinctResponse[0][0] == undefined)" Process
                        // If there is Initial DNT,then go to "else" Process
                        if (distinctResponse[0][0] == undefined) {
                            var distinctid = 'DNT1';
                            groupObj[uniqueProductsCodes[i]].dnt = distinctid;
                            await logisConnection.query('INSERT INTO supplies (distinctid, suprecallid, supholdingsid, supetcid) VALUES (?, ?, ?, ?)', [distinctid, groupObj[uniqueProductsCodes[i]].recall, groupObj[uniqueProductsCodes[i]].holdings, groupObj[uniqueProductsCodes[i]].etc])

                            await logisConnection.query('INSERT INTO supplyinqueries (date, itemid, distinctid) VALUES (? ,? ,?)', [raw[0].date, uniqueProductsCodes[i], groupObj[uniqueProductsCodes[i]].dnt])

                        } else {
                            // Bring inserted data from supplies database based on Date, ItemCode
                            // If there is pre-inserted data, then go to "if (preEx[0][0])" Process
                            // If not then go to "else" Process 
                            var preEx = await logisConnection.query('SELECT suprecallid, supholdingsid, supetcid FROM supplies WHERE distinctid IN (SELECT distinctid FROM supplyinqueries WHERE date = ? AND itemid = ?)', [raw[0].date, uniqueProductsCodes[i]])

                            if (preEx[0][0]) {
                                if(preEx[0][0].suprecallid == null && groupObj[uniqueProductsCodes[i]].recall != null) {
                                    await logisConnection.query('UPDATE supplies SET suprecallid =? WHERE distinctid IN (SELECT distinctid FROM supplyinqueries WHERE date = ? AND itemid = ?)', [groupObj[uniqueProductsCodes[i]].recall, raw[0].date, uniqueProductsCodes[i]]);
                                } 
                                
                                if (preEx[0][0].supholdingsid == null && groupObj[uniqueProductsCodes[i]].holdings != null) {
                                    await logisConnection.query('UPDATE supplies SET supholdingsid = ? WHERE distinctid IN (SELECT distinctid FROM supplyinqueries WHERE date = ? AND itemid = ?)', [groupObj[uniqueProductsCodes[i]].holdings, raw[0].date, uniqueProductsCodes[i]]);
                                } 
                                if (preEx[0][0].supetcid == null && groupObj[uniqueProductsCodes[i]].etc != null) {
                                    await logisConnection.query('UPDATE supplies SET supetcid = ? WHERE distinctid IN (SELECT distinctid FROM supplyinqueries WHERE date = ? AND itemid = ?)', [groupObj[uniqueProductsCodes[i]].etc, raw[0].date, uniqueProductsCodes[i]]);
                                }
                            } else {
                                var num = parseInt(distinctResponse[0].length) + 1;
                                var distinctid = 'DNT' + num;
                                groupObj[uniqueProductsCodes[i]].dnt = distinctid;
                                await logisConnection.query('INSERT INTO supplies (distinctid, suprecallid, supholdingsid, supetcid) VALUES (?, ?, ?, ?)', [distinctid, groupObj[uniqueProductsCodes[i]].recall, groupObj[uniqueProductsCodes[i]].holdings, groupObj[uniqueProductsCodes[i]].etc]);

                                await logisConnection.query('INSERT INTO supplyinqueries (date, itemid, distinctid) VALUES (? ,? ,?)', [raw[0].date, uniqueProductsCodes[i], groupObj[uniqueProductsCodes[i]].dnt])
                            }
                        }
                        
                    }
                    resolve(1);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            }
        )
    }

    checkExistenceOrder (raw) {
        return new Promise (
            async (resolve, reject) => {
                var productCodes = new Array();
                raw.map((data) => {
                    productCodes.push(data.cellCode);
                })

                // Eliminate Duplicated Value
                var uniqueProductsCodes = Array.from(new Set(productCodes));
                var objComponent = new Object();

                uniqueProductsCodes.map((data) => {
                    objComponent[data] = {
                        sell : null,
                        holdings : null,
                        etc : null,
                    }
                })
                try {
                    for ( var i = 0; i < raw.length; i++) {
                        var sql = 'SELECT ordsellid, ordholdingsid, ordetcid FROM orders WHERE distinctid IN (SELECT distinctid FROM orderinqueries WHERE date = ? AND itemid = ?)';
                        var resResult = await logisConnection.query(sql, [raw[i].date, raw[i].cellCode]);
                        for (var j = 0; j < resResult[0].length; j++) {
                            if (resResult[0][j].ordsellid) {
                                objComponent[raw[i].cellCode].sell = resResult[0][j].ordsellid;
                            } 
                            
                            if (resResult[0][j].ordholdingsid) {
                                objComponent[raw[i].cellCode].holdings = resResult[0][j].ordholdingsid;
                            } 
                            
                            if (resResult[0][j].ordetcid) {
                                objComponent[raw[i].cellCode].etc = resResult[0][j].ordetcid;
                            } 
                        }
                    }
                    resolve(objComponent);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    putOrderListToDB (data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var uniqueProductsCodes = Object.keys(data.preset);
                    var raw = data.dataset;
                    
                    var groupObj = new Object();

                    uniqueProductsCodes.map((data) => {
                        groupObj[data] = {
                            sell : null,
                            holdings : null,
                            etc : null,
                        }
                    })
                    
                    for (var x = 0; x < uniqueProductsCodes.length; x++) {
                        for (var i = 0; i < raw.length; i++) {

                            if (uniqueProductsCodes[x] == raw[i].cellCode) {
                                // Get Recall Data From Recall Table 
                                if (raw[i].cellDnt == '구매') {
                                    var sellResponse = await logisConnection.query('SELECT * FROM ordersells')
                                    if (sellResponse[0][0] == undefined) {
                                        var sellid = 'R1';
                                    } else {
                                        var num = parseInt(sellResponse[0].length) + 1;
                                        var sellid = 'R' + num;
                                    }

                                    await logisConnection.query('INSERT INTO ordersells (ordsellid, qty) VALUES (?, ?)', [sellid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].sell = sellid;

                                    // Get Holdings Data From Holdings Table 
                                } else if (raw[i].cellDnt == '본사') {
                                    var holdingsResponse = await logisConnection.query('SELECT * FROM orderholdings')
                                    if (holdingsResponse[0][0] == undefined) {
                                        var holdingsid = 'H1';
                                    } else {
                                        var num = parseInt(holdingsResponse[0].length) + 1;
                                        var holdingsid = 'H' + num;
                                    }

                                    await logisConnection.query('INSERT INTO orderholdings (ordholdingsid, qty) VALUES (?, ?)', [holdingsid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].holdings = holdingsid;


                                    // Get ETC Data From ETC Table
                                } else {
                                    var etcResponse = await logisConnection.query('SELECT * FROM orderetc')
                                    if (etcResponse[0][0] == undefined) {
                                        var etcid = 'E1';
                                    } else {
                                        var num = parseInt(etcResponse[0].length) + 1;
                                        var etcid = 'E' + num;
                                    }
                                    await logisConnection.query('INSERT INTO orderetc (ordetcid, qty) VALUES (?, ?)', [etcid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].etc = etcid;
                                }
                            }
                        }
                    }
                    for (var i = 0; i <uniqueProductsCodes.length; i++) {
                        var distinctResponse = await logisConnection.query('SELECT * FROM orders');
                        // DNT Initial, DNT Number Existence Check
                        // If there is no Initial DNT, then go to "if(distinctResponse[0][0] == undefined)" Process
                        // If there is Initial DNT,then go to "else" Process
                        if (distinctResponse[0][0] == undefined) {
                            var distinctid = 'DNT1';
                            groupObj[uniqueProductsCodes[i]].dnt = distinctid;
                            await logisConnection.query('INSERT INTO orders (distinctid, ordsellid, ordholdingsid, ordetcid) VALUES (?, ?, ?, ?)', [distinctid, groupObj[uniqueProductsCodes[i]].sell, groupObj[uniqueProductsCodes[i]].holdings, groupObj[uniqueProductsCodes[i]].etc])

                            await logisConnection.query('INSERT INTO orderinqueries (date, itemid, distinctid) VALUES (? ,? ,?)', [raw[0].date, uniqueProductsCodes[i], groupObj[uniqueProductsCodes[i]].dnt])

                        } else {
                            // Bring inserted data from supplies database based on Date, ItemCode
                            // If there is pre-inserted data, then go to "if (preEx[0][0])" Process
                            // If not then go to "else" Process 
                            var preEx = await logisConnection.query('SELECT ordsellid, ordholdingsid, ordetcid FROM orders WHERE distinctid IN (SELECT distinctid FROM orderinqueries WHERE date = ? AND itemid = ?)', [raw[0].date, uniqueProductsCodes[i]])

                            if (preEx[0][0]) {
                                if(preEx[0][0].ordsellid == null && groupObj[uniqueProductsCodes[i]].sell != null) {
                                    await logisConnection.query('UPDATE orders SET ordsellid =? WHERE distinctid IN (SELECT distinctid FROM orderinqueries WHERE date = ? AND itemid = ?)', [groupObj[uniqueProductsCodes[i]].sell, raw[0].date, uniqueProductsCodes[i]]);
                                } 
                                
                                if (preEx[0][0].ordholdingsid == null && groupObj[uniqueProductsCodes[i]].holdings != null) {
                                    await logisConnection.query('UPDATE orders SET ordholdingsid = ? WHERE distinctid IN (SELECT distinctid FROM orderinqueries WHERE date = ? AND itemid = ?)', [groupObj[uniqueProductsCodes[i]].holdings, raw[0].date, uniqueProductsCodes[i]]);
                                } 
                                if (preEx[0][0].ordetcid == null && groupObj[uniqueProductsCodes[i]].etc != null) {
                                    await logisConnection.query('UPDATE orders SET ordetcid = ? WHERE distinctid IN (SELECT distinctid FROM orderinqueries WHERE date = ? AND itemid = ?)', [groupObj[uniqueProductsCodes[i]].etc, raw[0].date, uniqueProductsCodes[i]]);
                                }
                            } else {
                                var num = parseInt(distinctResponse[0].length) + 1;
                                var distinctid = 'DNT' + num;
                                groupObj[uniqueProductsCodes[i]].dnt = distinctid;
                                await logisConnection.query('INSERT INTO orders (distinctid, ordsellid, ordholdingsid, ordetcid) VALUES (?, ?, ?, ?)', [distinctid, groupObj[uniqueProductsCodes[i]].sell, groupObj[uniqueProductsCodes[i]].holdings, groupObj[uniqueProductsCodes[i]].etc]);

                                await logisConnection.query('INSERT INTO orderinqueries (date, itemid, distinctid) VALUES (? ,? ,?)', [raw[0].date, uniqueProductsCodes[i], groupObj[uniqueProductsCodes[i]].dnt])
                            }
                        }
                        
                    }
                    resolve(1);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            }
        )
    }

    preSuppliedListWithoutItem (data) {
        return new Promise (
            async (resolve, reject) => {
                var startDate = data.startYear + '-' + data.startMonth + '-' + data.startDay;
                var endDate = data.endYear + '-' + data.endMonth + '-' +data.endDay;
                var resArray = new Array();
                var getArray = new Array();
                var objResponse = {
                    date : null,
                    items : {
                        itemCode : null,
                        itemName : null,
                        itemVolume : null,
                        objset : {
                            recall : {
                                id : null,
                                qty : null
                            },
                            holdings : {
                                id : null,
                                qty : null
                            },
                            etc : {
                                id : null,
                                qty : null
                            }
                        }
                    }
                }
                try {
                    var sql = 'SELECT DATE_FORMAT(date, "%Y-%m-%e") AS date, itemid, distinctid FROM supplyinqueries WHERE date BETWEEN ? AND ?';
                    var response = await logisConnection.query(sql , [startDate, endDate]);
                    var resData = response[0];


                    for (var i = 0; i < resData.length; i++) {
                        objResponse.date = resData[i].date;

                        var itemsResponse = await logisConnection.query('SELECT name, volume, code FROM items WHERE code = ?', [resData[i].itemid]);
                        objResponse.items.itemCode = itemsResponse[0][0].code;
                        objResponse.items.itemName = itemsResponse[0][0].name;
                        objResponse.items.itemVolume = itemsResponse[0][0].volume;

                        // If there is no data related to Recalls at Supplyrecall database
                        var prerecallsupplies = await logisConnection.query('SELECT IFNULL(suprecallid, "empty") AS suprecallid FROM supplies WHERE distinctid=?', [resData[i].distinctid]);
                        if (prerecallsupplies[0][0].suprecallid == 'empty') {
                            objResponse.items.objset.recall.id = null;
                            objResponse.items.objset.recall.qty = null;

                        } else {
                            var suppliesResponse1 = await logisConnection.query('SELECT suprecallid, qty FROM supplyrecalls WHERE suprecallid=?', [prerecallsupplies[0][0].suprecallid]);
                            objResponse.items.objset.recall.id = suppliesResponse1[0][0].suprecallid;
                            objResponse.items.objset.recall.qty = suppliesResponse1[0][0].qty;
                        }

                        // If there is no data related to Holdings at Supplyholdings database
                        var preholdingssupplies = await logisConnection.query('SELECT IFNULL(supholdingsid, "empty") AS supholdingsid FROM supplies WHERE distinctid=?', [resData[i].distinctid]);
                        if (preholdingssupplies[0][0].supholdingsid == 'empty') {
                            objResponse.items.objset.holdings.id = null;
                            objResponse.items.objset.holdings.qty = null;

                        } else {
                            var suppliesResponse2 = await logisConnection.query('SELECT supholdingsid, qty FROM supplyholdings WHERE supholdingsid=?', [preholdingssupplies[0][0].supholdingsid]);
                            objResponse.items.objset.holdings.id = suppliesResponse2[0][0].supholdingsid;
                            objResponse.items.objset.holdings.qty = suppliesResponse2[0][0].qty;
                        }

                        // If there is no data related to ETC at Supplyetc database
                        var prerecallsupplies = await logisConnection.query('SELECT IFNULL(supetcid, "empty") AS supetcid FROM supplies WHERE distinctid=?', [resData[i].distinctid]);
                        if (prerecallsupplies[0][0].supetcid == 'empty') {
                            objResponse.items.objset.etc.id = null;
                            objResponse.items.objset.etc.qty = null;

                        } else {
                            var suppliesResponse3 = await logisConnection.query('SELECT supetcid, qty FROM supplyetc WHERE supetcid=?', [prerecallsupplies[0][0].supetcid]);
                            objResponse.items.objset.etc.id = suppliesResponse3[0][0].supetcid;
                            objResponse.items.objset.etc.qty = suppliesResponse3[0][0].qty;
                        }
                        resArray[i] = JSON.stringify(objResponse);
                        getArray[i] = JSON.parse(resArray[i]);
                    }
                    resolve(getArray)
                } catch (err) {
                    reject(err)
                    console.log(err)
                }
            } 
        )
    }

    preSuppliedList (data) {
        return new Promise (
            async (resolve, reject) => {
                var startDate = data.startYear + '-' + data.startMonth + '-' + data.startDay;
                var endDate = data.endYear + '-' + data.endMonth + '-' +data.endDay;
                var resArray = new Array();
                var getArray = new Array();
                var objResponse = {
                    date : null,
                    items : {
                        itemCode : null,
                        itemName : null,
                        itemVolume : null,
                        objset : {
                            recall : {
                                id : null,
                                qty : null
                            },
                            holdings : {
                                id : null,
                                qty : null
                            },
                            etc : {
                                id : null,
                                qty : null
                            }
                        }
                    }
                }

                try {
                    var sql = 'SELECT DATE_FORMAT(date, "%Y-%m-%e") AS date, itemid, distinctid FROM supplyinqueries WHERE (date BETWEEN ? AND ?) AND itemid = ?';
                    var response = await logisConnection.query(sql , [startDate, endDate, data.itemCode]);
                    var resData = response[0];
                    for (var i = 0; i < resData.length; i++) {
                        objResponse.date = resData[i].date;

                        var itemsResponse = await logisConnection.query('SELECT name, volume, code FROM items WHERE code = ?', [resData[i].itemid]);
                        objResponse.items.itemCode = itemsResponse[0][0].code;
                        objResponse.items.itemName = itemsResponse[0][0].name;
                        objResponse.items.itemVolume = itemsResponse[0][0].volume;
                        
                        // If there is no data related to Recall at Supplyrecalls database
                        var prerecallsupplies = await logisConnection.query('SELECT IFNULL(suprecallid, "empty") AS suprecallid FROM supplies WHERE distinctid=?', [resData[i].distinctid]);
                        if (prerecallsupplies[0][0].suprecallid == 'empty') {
                            objResponse.items.objset.recall.id = null;
                            objResponse.items.objset.recall.qty = null;

                        } else {
                            var suppliesResponse1 = await logisConnection.query('SELECT suprecallid, qty FROM supplyrecalls WHERE suprecallid=?', [prerecallsupplies[0][0].suprecallid]);
                            objResponse.items.objset.recall.id = suppliesResponse1[0][0].suprecallid;
                            objResponse.items.objset.recall.qty = suppliesResponse1[0][0].qty;
                        }

                        // If there is no data related to Holdings at Supplyholdings database
                        var preholdingssupplies = await logisConnection.query('SELECT IFNULL(supholdingsid, "empty") AS supholdingsid FROM supplies WHERE distinctid=?', [resData[i].distinctid]);
                        if (preholdingssupplies[0][0].supholdingsid == 'empty') {
                            objResponse.items.objset.holdings.id = null;
                            objResponse.items.objset.holdings.qty = null;

                        } else {
                            var suppliesResponse2 = await logisConnection.query('SELECT supholdingsid, qty FROM supplyholdings WHERE supholdingsid=?', [preholdingssupplies[0][0].supholdingsid]);
                            objResponse.items.objset.holdings.id = suppliesResponse2[0][0].supholdingsid;
                            objResponse.items.objset.holdings.qty = suppliesResponse2[0][0].qty;
                        }

                        // If there is no data related to ETC at Supplyetc database
                        var prerecallsupplies = await logisConnection.query('SELECT IFNULL(supetcid, "empty") AS supetcid FROM supplies WHERE distinctid=?', [resData[i].distinctid]);
                        if (prerecallsupplies[0][0].supetcid == 'empty') {
                            objResponse.items.objset.etc.id = null;
                            objResponse.items.objset.etc.qty = null;

                        } else {
                            var suppliesResponse3 = await logisConnection.query('SELECT supetcid, qty FROM supplyetc WHERE supetcid=?', [prerecallsupplies[0][0].supetcid]);
                            objResponse.items.objset.etc.id = suppliesResponse3[0][0].supetcid;
                            objResponse.items.objset.etc.qty = suppliesResponse3[0][0].qty;
                        }
                        resArray[i] = JSON.stringify(objResponse);
                        getArray[i] = JSON.parse(resArray[i]);
                    }
                    resolve(getArray)
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
}

module.exports = new Product();