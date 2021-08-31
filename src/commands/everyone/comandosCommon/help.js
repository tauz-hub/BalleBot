import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'

export default {
    name: 'help',
    description: `${prefix}help <comando> `,
    permissions: ['everyone'],
    aliases: ['help2', 'help3'],
    category: 'Utility ⛏️',
    run: ({ message, client, args }) => {

        const commandsDatabase = new db.table('commandsDatabase')

        //const helpCommand = args[0].replace('=', '')

        let helpCommand = args[0]
        if (helpCommand) helpCommand = helpCommand.replace('=', '')

        const fullCommand = commandsDatabase.get(`${helpCommand}`);

        let markedAliases = [],
            markedPermissions = [];

        if (!fullCommand) {
            let getNamesCommands = []
            const allCommands = commandsDatabase.all()
            let namesCategories = {}

            for (let i = 0; i < allCommands.length; i++) {
                const commandAmongAll = JSON.parse(allCommands[i].data)

                let categoryCommand = commandAmongAll.category;

                if (namesCategories[categoryCommand]) {
                    namesCategories[categoryCommand].namesCommands.push('`' + `${prefix}` + `${commandAmongAll.name}` + '`')
                } else {
                    if (categoryCommand === undefined) {
                        if (namesCategories['Sem categoria ❔']) {
                            namesCategories['Sem categoria ❔'].namesCommands.push('`' + `${prefix}` + `${commandAmongAll.name}` + '`')

                        } else {
                            namesCategories['Sem categoria ❔'] = {
                                namesCommands: ['`' + `${prefix}` + `${commandAmongAll.name}` + '`']
                            }
                        }

                    } else {
                        namesCategories[categoryCommand] = {
                            namesCommands: ['`' + `${prefix}` + `${commandAmongAll.name}` + '`']
                        }
                    }
                }
            }
            let listTempleteCategories = Object.getOwnPropertyNames(namesCategories).sort()

            function getMessageCommands() {
                return listTempleteCategories.reduce((prev, arr, index) => {

                    return prev + `**${listTempleteCategories[index]}** \n ${namesCategories[listTempleteCategories[index]].namesCommands.join(' | ')}\n\n`
                }, '');
            }

            getNamesCommands.sort()
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setAuthor('Balle Bot', client.user.displayAvatarURL({ dynamic: true }), 'https://discord.gg/ballerini')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Ajuda Sobre Comandos e Funções:`)
                .setDescription('**Essas são as categorias e comandos que podem ser usados: **\n\n' + getMessageCommands())
                .setFooter(`• Para saber as informações de um comando específico, use ${prefix}help <comando>`))
            return
        }

        for (let i = 0; i < fullCommand.aliases.length; i++) {
            markedAliases[i] = '`' + `${prefix}` + fullCommand.aliases[i] + '`'
        }
        for (let i = 0; i < fullCommand.permissions.length; i++) {
            markedPermissions[i] = '`' + fullCommand.permissions[i] + '`'
        }

        if (markedAliases.length === 0) markedAliases[0] = '`Este comando não possui sinônimos`'
        message.channel.send(message.author, new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle('Informações sobre o comando `' + prefix + helpCommand + '`:')
            .setDescription(
                `**• Categoria: ${fullCommand.category || 'Sem Categoria'}**\n` +
                '\n**• Como usar:**\n`' +
                fullCommand.description +
                '`\n**• Cargos necessários para usá-lo: **\n' +
                markedPermissions.join(' | ') +
                '\n**• Sinônimos: **\n' +
                markedAliases.join(' | ')));
        return;
    }
};