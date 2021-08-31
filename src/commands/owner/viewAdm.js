import Discord from 'discord.js'
import { prefix } from '../../assets/prefix.js'
import db from 'quick.db'

export default {
    name: 'viewAdm',
    description: `Para ver os cargos administrativos do seu servidor digite ${prefix}viewAdm`,
    permissions: ['owner'],
    aliases: ['verAdm', 'adm'],
    category: 'Owner 🗡️',
    run: ({ message, client, args }) => {

        const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

        let permissions = guildIdDatabase.get('admIds'),
            serverMember = client.guilds.cache.get(message.guild.id);

        for (let role in permissions) {
            permissions[role] = serverMember.roles.cache.get(permissions[role])
        }

        message.channel.send(message.author, new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Esses são os cargos Administrativos:`)
            .setTimestamp()
            .setDescription(`**Para atualizar os cargos use ${prefix}setAdm @padawan @mods @staff.**
            \nCada cargo possui acesso a comandos de acordo com sua hierarquia, para saber se um cargo pode usar um comando use ${prefix}help <comando>`)
            .addFields({ name: 'Padawan', value: permissions.padawans, inline: true }, { name: 'Mods', value: permissions.mods, inline: true }, { name: 'Staff', value: permissions.staff, inline: true })
        )
    }
}