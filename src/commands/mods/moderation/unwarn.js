import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'
import { getUserOfCommand } from '../../../../utils/getUserMention/getUserOfCommand.js'

export default {
    name: 'unwarn',
    description: `${prefix}unwarn <idUser> <aviso1> ou ${prefix}unwarn @user <aviso1> ou ${prefix}unwarn <tagUser> <aviso1>`,
    permissions: ['mods'],
    aliases: ['removewarn'],
    category: 'Moderação ⚔️',
    run: ({ message, client, args }) => {

        const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

        const { user, index } = getUserOfCommand(client, message)

        if (!user) {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Não encontrei o usuário!`)
                .setDescription(`**Tente usar**` + '```' + `${prefix}unwarn @usuário <aviso 1>` + '```')
                .setTimestamp())
            return
        }

        let warnRemove = message.content.slice(index, message.content.length).replace(/\s/g, '').replace(/aviso/i, '') - 1 //tirando a ilusão do aviso 1 do warnlist

        if (guildIdDatabase.has(`user_id_${user.id}`)) {

            if (!args[1]) return message.channel.send('selecione um aviso que existe: ex. aviso1 returnnn')

            if (isNaN(warnRemove)) {
                console.log('warnRemove: ' + warnRemove)
                if (warnRemove === 'all') {
                    guildIdDatabase.delete(`user_id_${user.id}.reasons`)
                    guildIdDatabase.set(`user_id_${user.id}.warnsCount`, 0)
                    guildIdDatabase.set(`user_id_${user.id}.reasons`, [])

                    message.channel.send(message.author, new Discord.MessageEmbed()
                        .setColor('#ff8997')
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                        .setTitle(`Todos os avisos foram removidos do usuário ${user.tag}`)
                        .setDescription(`**O usuário não possui avisos**`)
                        .setFooter(`Id do user: ${user.id}`)
                        .setTimestamp())
                    return;
                }

                return message.channel.send('selecione um aviso que existe: ex. aviso1')
            }

            let reasons = guildIdDatabase.get(`user_id_${user.id}.reasons`)


            if (reasons.length !== 0) {
                if (warnRemove > reasons.length) { return message.channel.send(`este usuário não possui o aviso ${warnRemove + 1}`) }

                let avisoDeleted = reasons[warnRemove]
                reasons.splice(warnRemove, 1)

                guildIdDatabase.delete(`user_id_${user.id}.reasons`)
                guildIdDatabase.set(`user_id_${user.id}.reasons`, reasons)

                guildIdDatabase.subtract(`user_id_${user.id}.warnsCount`, 1)

                message.channel.send(message.author, new Discord.MessageEmbed()
                    .setColor('#ff8997')
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`Aviso ${warnRemove + 1} foi removido do usuário ${user.tag}`)
                    .setDescription(`**Aviso:**\n ${avisoDeleted}`)
                    .setFooter(`Id do user: ${user.id}`)
                    .setTimestamp())

            } else {
                message.channel.send('este usuário não possui avisos')
            }
        } else {
            message.channel.send('usuário não encontrado no banco')
        }


    }
}