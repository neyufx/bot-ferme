const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const db = require('../database/db.js');
var curr = new Date; // get current date


module.exports = {
	name: 'kilo',
    description: 'Ajouts des kilos',
    execute(message,args){
        let arg1 = args[0];
        db.pool.getConnection(function(err, connection) {
          // Use the connection
          if (arg1 < 1001 && arg1 > -501){ // si nb de kilo renseigné < 1000
            var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            var last = first + 6; // last day is the first day + 6
            var firstdate = new Date(curr.setDate(first)).toISOString().slice(0, 10);
            var lastdate = new Date(curr.setDate(curr.getDate()+6)).toISOString().slice(0, 10);
          connection.query(`SELECT SUM(quantite) as totalQuantite FROM dossiers WHERE date BETWEEN "${firstdate}" AND "${lastdate}" AND numero = "${message.channel.id}"`, function (error, results, fields) {
            if(results[0]['totalQuantite'])
            {
              var result = parseInt(results[0]['totalQuantite'])+parseInt(arg1)
              
            }else{var result = arg1;}
            const embedMessage = new MessageEmbed()
            .setTitle("Ajout de kilos 🌾")
            .setColor("#E67E22")
            .setDescription("Ajout de "+arg1+" kilos pour un total de "+result+" kilos");
            message.channel.send({embeds: [embedMessage]});
          // When done with the connection, release it.
          connection.release();
          // Handle error after the release.
          if (error) throw error;
          // Don't use the connection here, it has been returned to the pool.
          });
        }
        else{ // sinon
          message.channel.send('Kilos trop élevé !')
        }
          
        });
    }
};