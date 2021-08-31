import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'
import { getUserOfCommand } from '../../../../utils/getUserMention/getUserOfCommand.js'

export default {
    name: 'warnlist',
    description: `${prefix}warnlist @user ou ${prefix}warnlist <tagUser> ou ${prefix}warnlist <idUser> para adicionar o chat de report do bot`,
    permissions: ['everyone'],
    aliases: ['warns'],
    category: 'Moderação ⚔️',
    run: ({ message, client, args }) => {

        const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

        const { user } = getUserOfCommand(client, message)

        if (!user) {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Não encontrei o usuário!`)
                .setDescription(`**Tente usar**` + '```' + `${prefix}warnlist @usuário` + '```')
                .setTimestamp())
            return
        }

        console.log({ user })
        if (guildIdDatabase.has(`user_id_${user.id}`)) {
            let myUser = guildIdDatabase.get(`user_id_${user.id}`)

            let warnUser = myUser.reasons

            if (warnUser) {
                function getMessageCommands() {
                    return warnUser.reduce((prev, arr, index) => {
                        return prev + `**Aviso ${index+1}:** \n ${warnUser[index]}\n\n`
                    }, '');
                }
                message.channel.send(message.author, new Discord.MessageEmbed()
                    .setColor('#ff8997')
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`Lista de warns do usuário ${myUser.name + '#' + myUser.discriminator}`)
                    .setDescription(` ${getMessageCommands()}`))

            } else {
                message.channel.send('usuário não encontrado no banco')
            }
        } else {
            message.channel.send('usuário não encontrado no banco')
        }
    }
}