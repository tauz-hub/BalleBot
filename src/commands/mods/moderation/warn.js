import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'
import { getUserOfCommand } from '../../../../utils/getUserMention/getUserOfCommand.js'

export default {
    name: 'warn',
    description: `${prefix}warn <userId> <motivo> ou ${prefix}warn @usuário <motivo> ou ${prefix}warn <userTag> <motivo>`,
    permissions: ['mods'],
    aliases: ['addwarn'],
    category: 'Moderação ⚔️',
    run: ({ message, client, args }) => {

        const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

        const { user, index } = getUserOfCommand(client, message);

        if (!user) {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Não encontrei o usuário!`)
                .setDescription(`**Tente usar**` + '```' + `${prefix}warn @usuário <motivo>` + '```')
                .setTimestamp())
            return
        }
        let reason = '<Motivo não especificado>'

        if (args[1]) { reason = message.content.slice(index, message.content.length) }


        if (guildIdDatabase.has(`user_id_${user.id}`)) {

            guildIdDatabase.set(`user_id_${user.id}.name`, user.username)
            guildIdDatabase.set(`user_id_${user.id}.discriminator`, user.discriminator)
            guildIdDatabase.add(`user_id_${user.id}.warnsCount`, 1)
            guildIdDatabase.push(`user_id_${user.id}.reasons`, reason)

        } else {
            guildIdDatabase.set(`user_id_${user.id}`, {
                name: user.username,
                discriminator: user.discriminator,
                id: user.id,
                warnsCount: 1,
                reasons: [reason]
            })
        }
        user.send(
            new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Você recebeu um warn!`)
            .setDescription('**Motivo: **\n' + '```' + reason + '```' + `\n**Aplicada por: ${message.author.tag}**`)
            .setFooter(`Id do user: ${user.id}`)
            .setTimestamp())

        message.channel.send(message.author, new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`O usuário ${user.tag} foi punido!`)
            .setDescription('**Motivo: **\n\n' + '```' + `${reason}` + '```')
            .setFooter(`Id do user: ${user.id}`)
            .setTimestamp())
    }
}