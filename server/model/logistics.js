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
                    console.log('raw', raw)
                    var productCodes = new Array();
                    raw.map((data) => {
                        productCodes.push(data.cellCode);
                    })

                    // Eliminate Duplicated Value
                    var uniqueProductsCodes = Array.from(new Set(productCodes));
                    var groupObj = new Object();

                    console.log(uniqueProductsCodes)
                    uniqueProductsCodes.map((data) => {
                        groupObj[data] = {
                            recall : null,
                            holdings : null,
                            etc : null,
                        }
                    })
                    console.log('groupObj', groupObj);
                    for (var x = 0; x < uniqueProductsCodes.length; x++) {
                        console.log(uniqueProductsCodes[x])
                        for (var i = 0; i < raw.length; i++) {

                            if (uniqueProductsCodes[x] == raw[i].cellCode) {
                                console.log(uniqueProductsCodes[x])
                                // Get Recall Data From Recall Table 
                                if (raw[i].cellDnt == '반품') {
                                    console.log("recall")

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
                                    console.log("holdings")

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
                                    console.log("etc")

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

                    console.log('a', groupObj)
                    for (var i = 0; i < uniqueProductsCodes.length; i++) {
                        var distinctResponse = await logisConnection.query('SELECT * FROM supplydistinct');
                        if (distinctResponse[0][0] == undefined) {
                            var distinctid = 'DNT1';
                        } else {
                            var data = parseInt(distinctResponse[0].length) + 1;
                            var distinctid = 'DNT' + data;
                        }

                        await logisConnection.query('INSERT INTO supplydistinct (distinctid, suprecallid, supholdingsid, supetcid) VALUES (?, ?, ?, ?)', [distinctid, groupObj[uniqueProductsCodes[i]].recall, groupObj[uniqueProductsCodes[i]].holdings, groupObj[uniqueProductsCodes[i]].etc])
                    }

                } catch (err) {

                }
            }
        )
    }
}

module.exports = new Product();