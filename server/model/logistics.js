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

                    uniqueProductsCodes.map((data) => {
                        groupObj[data] = null;
                    })

                    

                    for (var x = 0; x < uniqueProductsCodes.length; x++) {
                        var distinctGroup = new Array();

                        for (var i = 0; i < raw.length; i++) {

                            if (uniqueProductsCodes[x] == raw[i].cellCode) {

                                // Get Recall Data From Recall Table 
                                if (raw[i].cellDnt == '반품') {
                                    var recallResponse = await logisConnection.query('SELECT * FROM supplyrecall')
                                    if (recallResponse[0][0] == undefined) {
                                        var recallid = 'R1';
                                    } else {
                                        var data = parseInt(recallResponse[0].length) + 1;
                                        var recallid = 'R' + data;
                                    }

                                    await logisConnection.query('INSERT INTO supplyrecall (itemid, suprecallid, qty) VALUES (?, ?, ?)', [raw[i].cellCode, recallid, raw[i].cellCnt]);
                                    distinctGroup.push(recallid);

                                    // Get Holdings Data From Holdings Table 
                                } else if (raw[i].cellDnt == '본사') {
                                    var holdingsResponse = await logisConnection.query('SELECT * FROM supplyholdings')
                                    if (holdingsResponse[0][0] == undefined) {
                                        var holdingsid = 'H1';
                                    } else {
                                        var data = parseInt(holdingsResponse[0].length) + 1;
                                        var holdingsid = 'H' + data;
                                    }

                                    await logisConnection.query('INSERT INTO supplyholdings (itemid, supholdingsid, qty) VALUES (?, ?, ?)', [raw[i].cellCode, holdingsid, raw[i].cellCnt]);
                                    distinctGroup.push(holdingsid);


                                    // Get ETC Data From ETC Table
                                } else {
                                    var etcResponse = await logisConnection.query('SELECT * FROM supplyetc')
                                    if (etcResponse[0][0] == undefined) {
                                        var etcid = 'E1';
                                    } else {
                                        var data = parseInt(etcResponse[0].length) + 1;
                                        var etcid = 'E' + data;
                                    }
                                    await logisConnection.query('INSERT INTO supplyetc (itemid, supetcid, qty) VALUES (?, ?, ?)', [raw[i].cellCode, etcid, raw[i].cellCnt]);
                                    distinctGroup.push(etcid);
                                }
                                groupObj[uniqueProductsCodes[x]] = distinctGroup;
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

                        await logisConnection.query('INSERT INTO supplydistinct (distinctid, suprecallid, supholdingsid, supetcid) VALUES (?, ?, ?, ?)', [distinctid, groupObj[uniqueProductsCodes[i]][0], groupObj[uniqueProductsCodes[i]][1], groupObj[uniqueProductsCodes[i]][2]])
                    }

                } catch (err) {

                }
            }
        )
    }
}

module.exports = new Product();