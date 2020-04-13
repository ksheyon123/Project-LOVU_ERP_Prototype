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
    putSupplyListToDB(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    
                } catch (err) {

                }
            }
        )
    }
}

module.exports = new Product();