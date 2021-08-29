import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'

export default {
    name: 'addLog',
    description: `${prefix}addLog para adicionar o chat de report do bot`,
    permissions: ['mods'],
    aliases: ['addChannelLog', 'setlog'],
    category: '❌ AntiSpam',
    run: ({ message, client, args }) => {

        const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

        args[0] = args[0].replace('<#', '')
        args[0] = args[0].replace('>', '')


        let channel = client.channels.cache.get(args[0])
        if (!channel) {
            message.channel.send("canal não existe");
            return;
        }
        guildIdDatabase.set('channel_log', args[0])

        message.channel.send(message.author, new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`${message.author.tag} O Chat Log foi atualizado com sucesso: ☑️`)
            .setDescription(`Chat setado: ${channel}`))

    }
};