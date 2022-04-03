const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, MessageEmbed, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const { Guild } = require('discord.js');
const db = require('../database/db.js');

module.exports = {
    name: 'salon',
    description: 'écrit les salons important',
    execute(message,args){
        const embedMessage = new MessageEmbed()
        .setTitle('🚪 Salons important')
        .setDescription('<#954147152823722024>\n<#954147198008958976>\n<#954147293836238908>\n<#954147077791830086>')
        .setColor('#E67E22')
        .setFooter({text:'© Ferme'})
        .setTimestamp();
        message.channel.send({embeds: [embedMessage]});
    }
}