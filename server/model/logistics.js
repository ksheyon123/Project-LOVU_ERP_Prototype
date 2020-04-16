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
    putSupplyListToDB(raw) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var productCodes = new Array();
                    raw.map((data) => {
                        productCodes.push(data.cellCode);
                    })

                    // Eliminate Duplicated Value
                    var uniqueProductsCodes = Array.from(new Set(productCodes));
                    var groupObj = new Object();

                    uniqueProductsCodes.map((data) => {
                        groupObj[data] = {
                            recall : null,
                            holdings : null,
                            etc : null,
                            dnt : null,
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
                                        var data = parseInt(recallResponse[0].length) + 1;
                                        var recallid = 'R' + data;
                                    }

                                    await logisConnection.query('INSERT INTO supplyrecalls (suprecallid, qty) VALUES (?, ?)', [recallid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].recall = recallid;

                                    // Get Holdings Data From Holdings Table 
                                } else if (raw[i].cellDnt == '본사') {
                                    var holdingsResponse = await logisConnection.query('SELECT * FROM supplyholdings')
                                    if (holdingsResponse[0][0] == undefined) {
                                        var holdingsid = 'H1';
                                    } else {
                                        var data = parseInt(holdingsResponse[0].length) + 1;
                                        var holdingsid = 'H' + data;
                                    }

                                    await logisConnection.query('INSERT INTO supplyholdings (supholdingsid, qty) VALUES (?, ?)', [holdingsid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].holdings = holdingsid;


                                    // Get ETC Data From ETC Table
                                } else {
                                    var etcResponse = await logisConnection.query('SELECT * FROM supplyetc')
                                    if (etcResponse[0][0] == undefined) {
                                        var etcid = 'E1';
                                    } else {
                                        var data = parseInt(etcResponse[0].length) + 1;
                                        var etcid = 'E' + data;
                                    }
                                    await logisConnection.query('INSERT INTO supplyetc (supetcid, qty) VALUES (?, ?)', [etcid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].etc = etcid;
                                }
                            }
                        }
                    }

                    for (var i = 0; i < uniqueProductsCodes.length; i++) {
                        var distinctResponse = await logisConnection.query('SELECT * FROM supplydistinct');
                        if (distinctResponse[0][0] == undefined) {
                            var distinctid = 'DNT1';
                        } else {
                            var data = parseInt(distinctResponse[0].length) + 1;
                            var distinctid = 'DNT' + data;
                        }
                        groupObj[uniqueProductsCodes[i]].dnt = distinctid;
                        await logisConnection.query('INSERT INTO supplydistinct (distinctid, itemid, suprecallid, supholdingsid, supetcid) VALUES (?, ?, ?, ?, ?)', [distinctid, uniqueProductsCodes[i], groupObj[uniqueProductsCodes[i]].recall, groupObj[uniqueProductsCodes[i]].holdings, groupObj[uniqueProductsCodes[i]].etc])
                    }

                    for (var i = 0; i < uniqueProductsCodes.length; i++) {
                        await logisConnection.query('INSERT INTO supplies (date, itemid, distinctid) VALUES (? ,? ,?)', [raw[0].date, uniqueProductsCodes[i], groupObj[uniqueProductsCodes[i]].dnt])
                    }
                    resolve(1);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            }
        )
    }

    putOrderListToDB = () => {
        return new Promise(
            async (resolve, reject) => {
                try {
                    var productCodes = new Array();
                    raw.map((data) => {
                        productCodes.push(data.cellCode);
                    })

                    // Eliminate Duplicated Value
                    var uniqueProductsCodes = Array.from(new Set(productCodes));
                    var groupObj = new Object();

                    uniqueProductsCodes.map((data) => {
                        groupObj[data] = {
                            recall : null,
                            holdings : null,
                            etc : null,
                            dnt : null,
                        }
                    })
                    for (var x = 0; x < uniqueProductsCodes.length; x++) {
                        console.log(uniqueProductsCodes[x])
                        for (var i = 0; i < raw.length; i++) {

                            if (uniqueProductsCodes[x] == raw[i].cellCode) {
                                // Get Recall Data From Recall Table 
                                if (raw[i].cellDnt == '판매') {
                                    var recallResponse = await logisConnection.query('SELECT * FROM ordercells')
                                    if (recallResponse[0][0] == undefined) {
                                        var recallid = 'R1';
                                    } else {
                                        var data = parseInt(recallResponse[0].length) + 1;
                                        var recallid = 'R' + data;
                                    }

                                    await logisConnection.query('INSERT INTO ordercells (supcellid, qty) VALUES (?, ?)', [recallid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].recall = recallid;

                                    // Get Holdings Data From Holdings Table 
                                } else if (raw[i].cellDnt == '본사') {
                                    var holdingsResponse = await logisConnection.query('SELECT * FROM supplyholdings')
                                    if (holdingsResponse[0][0] == undefined) {
                                        var holdingsid = 'H1';
                                    } else {
                                        var data = parseInt(holdingsResponse[0].length) + 1;
                                        var holdingsid = 'H' + data;
                                    }

                                    await logisConnection.query('INSERT INTO supplyholdings (supholdingsid, qty) VALUES (?, ?)', [holdingsid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].holdings = holdingsid;


                                    // Get ETC Data From ETC Table
                                } else {
                                    var etcResponse = await logisConnection.query('SELECT * FROM supplyetc')
                                    if (etcResponse[0][0] == undefined) {
                                        var etcid = 'E1';
                                    } else {
                                        var data = parseInt(etcResponse[0].length) + 1;
                                        var etcid = 'E' + data;
                                    }
                                    await logisConnection.query('INSERT INTO supplyetc (supetcid, qty) VALUES (?, ?)', [etcid, raw[i].cellCnt]);
                                    groupObj[uniqueProductsCodes[x]].etc = etcid;
                                }
                            }
                        }
                    }

                    for (var i = 0; i < uniqueProductsCodes.length; i++) {
                        var distinctResponse = await logisConnection.query('SELECT * FROM supplydistinct');
                        if (distinctResponse[0][0] == undefined) {
                            var distinctid = 'DNT1';
                        } else {
                            var data = parseInt(distinctResponse[0].length) + 1;
                            var distinctid = 'DNT' + data;
                        }
                        groupObj[uniqueProductsCodes[i]].dnt = distinctid;
                        await logisConnection.query('INSERT INTO supplydistinct (distinctid, itemid, suprecallid, supholdingsid, supetcid) VALUES (?, ?, ?, ?, ?)', [distinctid, uniqueProductsCodes[i], groupObj[uniqueProductsCodes[i]].recall, groupObj[uniqueProductsCodes[i]].holdings, groupObj[uniqueProductsCodes[i]].etc])
                    }

                    for (var i = 0; i < uniqueProductsCodes.length; i++) {
                        await logisConnection.query('INSERT INTO supplies (date, itemid, distinctid) VALUES (? ,? ,?)', [raw[0].date, uniqueProductsCodes[i], groupObj[uniqueProductsCodes[i]].dnt])
                    }
                    resolve(1);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            }
        )
    }

    preSuupliedList = (data) => {
        return new Promise (
            async (resolve, reject) => {
                try {
                    console.log(data)
                    var sql = 'SELECT * FROM supplies WHERE (date between ? AND ?) AND itemid=?'
                    await logisConnection.query(sql)
                } catch (err) {

                }
            }
        )
    }
}

module.exports = new Product();