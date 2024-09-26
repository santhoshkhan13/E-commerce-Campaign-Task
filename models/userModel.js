const {db} = require('../config/database');

// User Model
class UserModel {
    static createUser(username, password, email, callback) {
        db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email], function (err) {
            callback(err, this.lastID);
        });
    }

    static getUserByUsername(email, callback) {
        db.get('SELECT id, password FROM users WHERE email = ?', [email], callback);
    }

    static getUserById(id, callback) {
        db.get('SELECT id, username, email FROM users WHERE id = ?', [id], callback);
    }

    static updateUser(id, username, email, callback) {
        db.run('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id], function (err) {
            callback(err, this.changes);
        });
    }

    static deleteUser(id, callback) {
        db.run('DELETE FROM users WHERE id = ?', id, function (err) {
            callback(err, this.changes);
        });
    }
}

module.exports = UserModel;
