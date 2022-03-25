const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, MessageEmbed, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const { Guild } = require('discord.js');
const db = require('../database/db.js');

module.exports = {
    name: 'steam',
    description: 'Donne le steam de l\'employées',
    execute(message,args){
            db.pool.getConnection(function(err, connection) {
                if(err) throw err;
                connection.query(`SELECT steamlink FROM employees WHERE nomDossier = "${message.channel.name}"`, function(error, result,field) {
                    if(error) {
                        connection.release();
                    }else{
                        if (result){
                            const embedMessage = new MessageEmbed()
                            .setTitle('🔗 Lien Steam')
                            .setDescription('Le lien steam : '+result[0]['steamlink'] || 'Aucun steam enregistré')
                            .setColor('#E67E22')
                            .setFooter('© Ferme')
                            .setTimestamp();
                            message.channel.send({embeds: [embedMessage]})
                        // When done with the connection, release it.
                        connection.release();
                        // Handle error after the release.
                        if (error) throw error;
                        // Don't use the connection here, it has been returned to the pool.
                    }else{
                        console.log('mauvais salon');
                        const embedMessage = new MessageEmbed()
                            .setTitle('🔗 Lien Steam')
                            .setDescription('Il n\'y a pas de steam enregistré pour cette employé !')
                            .setColor('#E67E22')
                            .setFooter('© Ferme')
                            .setTimestamp();
                        message.channel.send({embeds: [embedMessage]})
                }
                    }
            })
        })
    }
}