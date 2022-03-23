const { Client, Collection, Intents, MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require('fs');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const config = require('./config.json');
const cron = require('cron');
const path = require('path');
const db = require('../database/db.js');
const { channel } = require('diagnostics_channel');
const fetch = require('node-fetch');
const prefix = "!";


/* Va chercher les commandes dans le dossier /commands */
bot.commands = new Collection();
const dirPath = path.resolve(__dirname, '../commands');
const commandFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`../commands/${file}`);
    bot.commands.set(command.name, command);
}


/* Vérifie que le bot est connecté */
bot.on('ready', () => {
    console.log(`Connectez en tant que : ${bot.user.tag}!`);
    bot.user.setStatus("online");
    bot.user.setActivity("Calculer les primes");
  });


  /* Création de message */
bot.on('messageCreate', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const gerantRole = message.member.roles.cache.some(role => role.name === 'Gérants');// rôle
    /* Si la commande user */
    if(gerantRole){
    if(command === 'user'){ // Commande !user <nomrp> <nomsteam> @taguser
        let arg1 = args[0];
        let arg2 = args[1];
        let arg3 = args[2];
        if(arg1 && arg2 && arg3)
        {
            bot.commands.get('user').execute(message,args);
        }
    }else if (command === 'kilo'){
        let arg1 = args[0];
        if (arg1){
            if(arg1 < 1001 && arg1 > -501){
            bot.commands.get('kilo').execute(message,args);
            db.pool.getConnection(function(err, connection) {
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = yyyy + '/' + mm + '/' + dd;
                // Use the connection
                connection.query(`SELECT id FROM employees WHERE nomDossier = "${message.channel.name}"`, function(error, result,field) {  
                    if (result[0] !== undefined){
                connection.query(`insert into dossiers(numero,quantite,nom,date,employee_id) values("${message.channel.id}","${arg1}","${message.channel.name}","${today}","${result[0]['id']}")`, function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                if (error) throw error;
                // Don't use the connection here, it has been returned to the pool.
                });
            }
            else{
                message.channel.send('Mauvais channel !')
            }
                });
              });
            }
            else{
                message.channel.send('Quantité de kilos trop élevé !')
            }
        }
    }else if (command === 'vire'){
        const Discord = require("discord.js");
        bot.commands.get('vire').execute(message,args);
        message.channel.send({files: ["./images/vire.gif"]});
        var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = yyyy + '/' + mm + '/' + dd;
                db.pool.getConnection(function(err, connection) {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    today = yyyy + '/' + mm + '/' + dd;
                    // Use the connection     
                    connection.query(`UPDATE employees SET isViree = "${today}" WHERE nomDossier = "${message.channel.name}"`, function (error, results, fields) {
                    // When done with the connection, release it.
                    connection.release();
                    // Handle error after the release.
                    if (error) throw error;
                    // Don't use the connection here, it has been returned to the pool.
                    });
        });
    }
    else if (command === 'semaine')
    {
        const Discord = require("discord.js");
        bot.commands.get('semaine').execute(message,args);
        const channel = bot.channels.cache.get('935208101014032384'); // id catégorie
        channel.children.forEach(e => {
            if(e.name !== undefined)
            {
                const channel01 = bot.channels.cache.get(e.id);
                channel01.send({files: ["./images/semaine.gif"]})
            }
        })
        //message.channel.send(`Le bot redémarre...`).then(process.exit(0));
        // ()=>bot.destroy()).then(()=>bot.login(config.token) 'dans le then'
    }
    else if (command === 'pause')
    {
        const Discord = require("discord.js");
        bot.commands.get('pause').execute(message,args);
    }
    else if (command === 'prime')
    {
        const Discord = require("discord.js");
        bot.commands.get('prime').execute(message,args);
        message.channel.send({files: ["./images/prime.gif"]});
        db.pool.getConnection(function(err, connection) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = yyyy + '/' + mm + '/' + dd;
            // Use the connection
            connection.query(`SELECT id FROM employees WHERE nomDossier = "${message.channel.name}"`, function(error, result,field) {  
                if (result[0] !== undefined){
            connection.query(`insert into primes(date,employee_id) values("${today}","${result[0]['id']}")`, function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();
            // Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool.
            });
        }
    })
})
    }
    else if (command === 'carte')
    {
        const file = new MessageAttachment("./images/carte.PNG");
        const embedMessage = new MessageEmbed()
        .setTitle('🗺️ Carte Ferme')
        .setImage('attachment://carte.PNG')
        .setColor('#E67E22')
        .setTimestamp();
        message.channel.send({embeds: [embedMessage], files: [file]});
    }
    else if (command === 'commandes')
    {
        message.channel.send('!user <nomrp> <nomsteam> @taguser\n!kilo <nbkilos>\n!vire\n!pause\n!semaine\n!prime\n!carte\n!steamreg <lien compte steam>\n!steam\n!classement\n!restart\n!salon\n!classement10')
    }
    else if (command === 'steamreg')
    {
        bot.commands.get('steamreg').execute(message,args);
    }
    else if (command === 'steam')
    {
        bot.commands.get('steam').execute(message,args);
    }
    else if (command === 'classement')
    {
        bot.commands.get('classement').execute(message,args);
    }
    else if (command === 'salon')
    {
        salons = ['<#954147152823722024>','<#954147198008958976>','<#954147293836238908>','<#954147077791830086>'];
        salons.forEach(element => {
            message.channel.send(element);
        })
        console.log(salons);
        bot.commands.get('salon').execute(message,args);
    }
    else if (command === 'classement10')
    {
        bot.commands.get('classement10').execute(message,args);
    }
    else if (command === 'restart'){
        fetch('https://api.heroku.com/apps/ferme-bot/dynos', {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/vnd.heroku+json; version=3',
                'Authorization': 'Bearer '+process.env.KEY
            }
        }).then(response => response.json())
        .then(response => console.log(response));
    }
}

});

let scheduledMessage = new cron.CronJob('00 06 22 * * *', () => {
    // This runs every day at 21:32:00, you can do anything you want
    let channel = bot.channels.get('954146765047750676'); // channel General-Hrp
    db.pool.getConnection(function(err, connection) {
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6
        var firstdate = new Date(curr.setDate(first)).toISOString().slice(0, 10);
        var lastdate = new Date(curr.setDate(curr.getDate()+6)).toISOString().slice(0, 10);
        connection.query(`SELECT employees.nomRp,SUM(quantite) as totalKg
        FROM dossiers JOIN employees on employee_id = employees.id 
        WHERE date BETWEEN "${firstdate}" AND "${lastdate}"
        group by nom
        ORDER by totalKg desc
        LIMIT 3`, function(error, result,field) {
            if (error) throw error;
            else if (result){
                let medals = ['🥇','🥈','🥉']
                function dateFormat(date){
                    var today = new Date(date);
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();
                    return dd + '/' + mm + '/' + yyyy;
                }
                function capitalizeFirstLetter(string) {
                    return string[0].toUpperCase() + string.slice(1);
                }
                channel.send(`🏆 Classement semaine du ${dateFormat(firstdate)} au ${dateFormat(lastdate)} @here :`)
                let i = 0;
                result.forEach(element => {
                    channel.send(`${medals[i++]}`+' - '+capitalizeFirstLetter(element['nomRp'].replace('-',' '))+' : '+element['totalKg']+'kg');
                });  
        } // fin if
        else{
        channel.send('Il n\'y a pas de classement cette semaine !');
        }
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        
        // Don't use the connection here, it has been returned to the pool.
    })
})


/* Affiche les erreurs dans la console */
bot.on('error', console.error);

/* Connecte le bot avec le token fourni en paramètre */
bot.login(process.env.TOKEN); // config.token