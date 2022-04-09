const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed, Guild } = require('discord.js');
const db = require('../database/db.js');


module.exports = {
	name: 'kilo',
    description: 'Ajouts des kilos',
    execute(message,args){
        let arg1 = args[0];
        db.pool.getConnection(function(err, connection) {
          // Use the connection
          if (arg1 < 1001 && arg1 > -501){ // si nb de kilo renseigné < 1000
            var curr = new Date;
            curr.setHours( curr.getHours() + 2 ); // ajout de 2 heures pour être à jour sur l'heure locale
            var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay())).toISOString().split('T')[0];
            var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+7)).toISOString().split('T')[0];
          connection.query(`SELECT SUM(quantite) as totalQuantite FROM dossiers WHERE date BETWEEN "${firstday}" AND "${lastday}" AND numero = "${message.channel.id}"`, function (error, results, fields) {
            if(results[0]['totalQuantite'] && results[0]['totalQuantite'] >= 0)
            {
              var result = parseInt(results[0]['totalQuantite'])
            }else{var result = arg1;}
            console.log(results[0]['totalQuantite']);
            const embedMessage = new MessageEmbed()
            .setTitle("── 🌾 Ajout de kilos 🌾 ──")
            .setColor("#E67E22")
            .setDescription("Ajout de : "+arg1+" kg \nTotal de : "+result+" kg")
            .setFooter({text:'© Ferme'});
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