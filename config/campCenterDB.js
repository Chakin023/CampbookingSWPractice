const mysql = require("mysql");

var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Chakin182*',
    database: 'campCenter'
});

module.exports = connection;