import Discord from 'discord.js'
import { prefix } from '../../prefix/prefix.js'
import { getChacaracteristicsInDatabase } from '../../database/getChacaracteristicsInDatabase.js'
export default {
    name: 'help',
    description: `${prefix}help <comando> `,
    permissions: ['everyone'],
    aliases: ['help2', 'help3'],
    run: ({ message, client, args }) => {

        const [getNames, getDescriptions, getPermissions, getAliases] = getChacaracteristicsInDatabase()
        let markedAliases = [],
            markedPermissions = []

        for (let j = 0; j < getNames.length; j++) {
            if (args[0] === getNames[j]) {
                for (let i = 0; i < getAliases[j].length; i++) {
                    markedAliases[i] = '`' + `${prefix}` + getAliases[j][i] + '`'
                }
                for (let i = 0; i < getPermissions[j].length; i++) {
                    markedPermissions[i] = '`' + `${prefix}` + getPermissions[j][i] + '`'
                }

                message.channel.send(message.author, new Discord.MessageEmbed()
                    .setColor('#ff8997')
                    .setTitle('Informações sobre o comando `' + `${prefix}` + getNames[j] + '`:')
                    .setDescription('**•Como usar:**\n `' +
                        getDescriptions[j] +
                        '`\n**• Cargos necessários para usá-lo: **\n' +
                        markedPermissions.join(' | ') +
                        '\n**• Sinônimos: **\n' +
                        markedAliases.join(' | '))
                    .setThumbnail('https://i.imgur.com/oKLZb0T.png')
                );
                return;
            }
        }

        for (let i = 0; i < getNames.length; i++) {
            getNames[i] = '`' + `${prefix}` + getNames[i] + '`'
        }
        message.channel.send(message.author, new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setTitle(`Ajuda BalleBot e Funções:`)
            .setDescription('**• Esses são os comandos que podem ser usados:**\n - ' +
                getNames.join(' | ') +
                '\n**• Para saber as informações de um comando específico, use `#help <comando>`**')
            .setThumbnail('https://i.imgur.com/oKLZb0T.png'))
    }
};