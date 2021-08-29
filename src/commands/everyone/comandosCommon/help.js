import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'

export default {
    name: 'help',
    description: `${prefix}help <comando> `,
    permissions: ['everyone'],
    aliases: ['help2', 'help3'],
    category: '⛏️ Utility',
    run: ({ message, client, args }) => {

        const commandsDatabase = new db.table('commandsDatabase')
        const helpCommand = args[0];

        const fullCommand = commandsDatabase.get(`${helpCommand}`);

        let markedAliases = [],
            markedPermissions = [];

        if (!fullCommand) {
            let getNamesCommands = []
            const allCommands = commandsDatabase.all()
            let namesCategories = {}

            for (let i = 0; i < allCommands.length; i++) {
                const commandAmongAll = JSON.parse(allCommands[i].data)

                let newCategory = true;
                let categoryCommand = commandAmongAll.category;

                if (namesCategories[categoryCommand]) {
                    namesCategories[categoryCommand].namesCommands.push('`' + `${prefix}` + `${commandAmongAll.name}` + '`')
                    newCategory = false;
                }

                if (newCategory) {
                    namesCategories[categoryCommand] = {
                        namesCommands: ['`' + `${prefix}` + `${commandAmongAll.name}` + '`']
                    }
                }

            }
            let listTempleteCategories = Object.getOwnPropertyNames(namesCategories)

            function getMessageCommands() {
                return listTempleteCategories.reduce((prev, arr, index) => {
                    return prev + `**${listTempleteCategories[index]}**: \n ${namesCategories[listTempleteCategories[index]].namesCommands}\n\n`
                }, '');
            }

            console.log(getMessageCommands())


            getNamesCommands.sort()
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Ajuda BalleBot e Funções:`)
                .setDescription('**Essas são as categorias e comandos que podem ser usados: **\n\n' +
                    getMessageCommands() +
                    '\n**• Para saber as informações de um comando específico, use `' + `${prefix}` + 'help <comando>`**'))
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
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
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