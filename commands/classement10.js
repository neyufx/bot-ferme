const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const { Guild } = require('discord.js');
const db = require('../database/db.js');

module.exports = {
    name: 'classement10',
    description: 'Donne le classement des employées',
    execute(message,args){
            db.pool.getConnection(function(err, connection) {
                var curr = new Date;
                curr.setHours( curr.getHours() + 1 ); // ajout d'1 heure pour être à jour sur l'heure locale
                var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay())).toISOString().split('T')[0];
                var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+7)).toISOString().split('T')[0];
                connection.query(`SELECT employees.nomRp,SUM(quantite) as totalKg
                FROM dossiers JOIN employees on employee_id = employees.id 
                WHERE date BETWEEN "${firstday}" AND "${lastday}"
                group by nom
                ORDER by totalKg desc
                LIMIT 10`, function(error, result,field) {
                    if (error) throw error;
                    else if (result){
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
                        message.channel.send(`Classement semaine du ${dateFormat(firstdate)} au ${dateFormat(lastdate)} :`)
                        let i = 1;
                        result.forEach(element => {
                            message.channel.send(`${i++}`+'. '+capitalizeFirstLetter(element['nomRp'].replace('-',' '))+' : '+element['totalKg']+'kg');
                        });
                        connection.query(`SELECT SUM(quantite) as totalKg 
                        FROM dossiers JOIN employees on employee_id = employees.id 
                        WHERE date BETWEEN "${firstdate}" AND "${lastdate}"`, function(error,result,field){
                            if (error) throw error;
                                else if (result){
                                    message.channel.send(`Total : `+ result[0]['totalKg']+` kg`);
                            }
                        })
                } // fin if
                else{
                message.channel.send('Il n\'y a pas de classement cette semaine !');
                }
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                
                // Don't use the connection here, it has been returned to the pool.
            })
        })
    }
}