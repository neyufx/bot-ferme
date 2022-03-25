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
                    console.log(error+' '+result[0]+' '+field+' ------------------')
                })
            })
    }
}