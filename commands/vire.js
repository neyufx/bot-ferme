const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../database/db.js');

module.exports = {
    name: 'vire',
    description: 'Vire un employé',
    execute(message,args){
        let arg1 = args[0];
        message.channel.setParent('954320950290157618'); // id du channel vire
        db.pool.getConnection(function(err, connection) {
          // Use the connection
          connection.query(`SELECT * FROM kilos`, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
          if (error) throw error;
          // Don't use the connection here, it has been returned to the pool.
          });
        });
    }
}