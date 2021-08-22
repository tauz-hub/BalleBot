import Discord from 'discord.js'
import { prefix } from '../../assets/prefix.js'
import db from 'quick.db'
const commandsDatabase = new db.table('commandsDatabase')

export default {
    name: 'help',
    description: `${prefix}help <comando> `,
    permissions: ['everyone'],
    aliases: ['help2', 'help3'],
    run: ({ message, client, args }) => {

        const helpCommand = args[0];
        const infoStringCommand = commandsDatabase.get(`${helpCommand}`);
        const fullCommand = JSON.parse(infoStringCommand);

        let markedAliases = [],
            markedPermissions = [];

        if (!infoStringCommand) {
            let getNamesCommands = []
            const allCommands = commandsDatabase.all()

            for (let i = 0; i < allCommands.length; i++) {
                const commandAmongAll = allCommands[i]
                getNamesCommands[i] = '`' + `${prefix}` + commandAmongAll.ID + '`'
            }

            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail('https://i.imgur.com/3Xto09h.png')
                .setTitle(`Ajuda BalleBot e Funções:`)
                .setDescription(
                    '**• Esses são os comandos que podem ser usados:**\n - ' +
                    getNamesCommands.join(' | ') +
                    '\n**• Para saber as informações de um comando específico, use `#help <comando>`**'))
            return
        }

        for (let i = 0; i < fullCommand.aliases.length; i++) {
            markedAliases[i] = '`' + `${prefix}` + fullCommand.aliases[i] + '`'
        }
        for (let i = 0; i < fullCommand.permissions.length; i++) {
            markedPermissions[i] = '`' + fullCommand.permissions[i] + '`'
        }
        message.channel.send(message.author, new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail('https://i.imgur.com/3Xto09h.png')
            .setTitle('Informações sobre o comando `' + `${prefix}` + helpCommand + '`:')
            .setDescription(
                '**•Como usar:**\n`' +
                fullCommand.description +
                '`\n**• Cargos necessários para usá-lo: **\n' +
                markedPermissions.join(' | ') +
                '\n**• Sinônimos: **\n' +
                markedAliases.join(' | ')));
        return;
    }
};