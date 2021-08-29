import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'

const channelLogGuildReport = new db.table('channelLogGuildReport')

export default {
    name: 'warnlist',
    description: `${prefix}warnlist para adicionar o chat de report do bot`,
    permissions: ['everyone'],
    aliases: ['warns'],
    category: '⚔️ moderação',
    run: ({ message, client, args }) => {

        const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

        let relatorioUser = guildIdDatabase.get(`user_id_${message.author.id}`)
        let envite = JSON.stringify(relatorioUser)

        console.log(relatorioUser)
        message.channel.send(message.author + `${envite}`)

    }
}