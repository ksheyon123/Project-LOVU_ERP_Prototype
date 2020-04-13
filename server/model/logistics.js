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

                    //Eliminate Duplicated Value
                    var uniqueProductsCodes = Array.from(new Set(productCodes));

                    var distinctGroup = new Array();
                    var groupObj = new Object();


                    for (var j = 0; j < uniqueProductsCodes.length; j++) {
                        for (var i = 0; i < raw.length; i++) {
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
                            } else if (raw[i].cellDnt == '본사') {
                                var holdingsResponse = await logisConnection.query('SELECT * FROM supplyrecall')
                                if (holdingsResponse[0][0] == undefined) {
                                    var holdingsid = 'H1';
                                } else {
                                    var data = parseInt(holdingsResponse[0].length) + 1;
                                    var holdingsid = 'H' + data;
                                }

                                await logisConnection.query('INSERT INTO supplyholdings (itemid, supholdingsid, qty) VALUES (?, ?, ?)', [raw[i].cellCode, holdingsid, raw[i].cellCnt]);
                                distinctGroup.push(holdingsid);
                            } else {
                                var etcResponse = await logisConnection.query('SELECT * FROM supplyetc')
                                if (etcResponse[0][0] == undefined) {
                                    var etcid = 'H1';
                                } else {
                                    var data = parseInt(etcResponse[0].length) + 1;
                                    var etcid = 'H' + data;
                                }
                                await logisConnection.query('INSERT INTO supplyholdings (itemid, supetcid, qty) VALUES (?, ?, ?)', [raw[i].cellCode, etcid, raw[i].cellCnt]);
                                distinctGroup.push(etcid);
                            }
                        }
                        console.log('hi')
                        var distinctResponse = await logisConnection.query('SELECT * FROM supplydistinct');
                        console.log(distinctResponse)
                        if (distinctResponse[0][0] == undefined) {
                            var distinctid = 'DNT1';
                        } else {
                            var distinctid = 'DNT' + distinctResponse[0].length + 1;
                        }

                        console.log('distinctGroup', distinctGroup)
                        await logisConnection.query('INSERT INTO supplydistinct (distinctid, suprecallid, supholdingsid, supetcid) VALUES (?, ?, ?, ?)', [distinctid, distinctGroup[0], distinctGroup[1], distinctGroupp[2]])
                    }


                } catch (err) {

                }
            }
        )
    }
}

module.exports = new Product();