var logisConnection = require('../dbConfig');

class User {
    login (data) {
        return new Promise(
            async (resolve, reject) => {
                var user = data.userId;
                var pw = data.userPw;
                var flags;
                try {
                    var sql = 'SELECT * FROM users WHERE userid = ? AND userpw = ?';
                    var authResult = await logisConnection.query(sql, [user, pw]);
                    if (!authResult[0][0]) {
                        flags = 0;
                    } else {
                        flags = 1;
                    }
                    resolve(flags)
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new User();