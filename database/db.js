const mysql = require('mysql');
require('dotenv').config();

    var pool = mysql.createPool({
        connectionLimit: 10,
        host: '153.92.220.151', // 153.92.220.151
        user: 'u463335117_ferme', // u463335117_brasserie
        password: 'Neyufx99&', // Neyufx99&
        database: 'u463335117_ferme', // u463335117_brasserie
        connectTimeout: 30000
    })
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.release();
        if (err) throw err;
    });

module.exports = { pool }; // Exporte la classe pour l'utiliser dans les autres 
