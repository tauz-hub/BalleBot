import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'

export default {
    name: 'Ping',
    description: `comando de ping para saber a latência, para usar digite ${prefix}ping`,
    permissions: ['everyone'],
    aliases: ['pong', 'peng'],
    category: '⛏️ Utility',
    run: ({ message, client }) => {

        message.channel.send("Loading").then(msg => {

            msg.edit('', new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setTitle('🏓Pong!')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(` Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(client.ws.ping)}ms`))
        });
    }
};