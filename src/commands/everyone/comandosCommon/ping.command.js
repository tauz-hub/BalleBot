import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';

export default {
  name: 'ping',
  description: `comando de ping para saber a latência, para usar digite ${prefix}ping`,
  permissions: ['everyone'],
  aliases: ['pong', 'peng'],
  dm: true,
  category: 'Utility ⛏️',
  run: ({ message, client }) => {
    message.channel.send('Loading').then((msg) => {
      const timestampDiff = msg.createdTimestamp - message.createdTimestamp;
      msg.edit(
        '',
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setTitle('🏓Pong!')

          .setThumbnail('https://i.imgur.com/gfDpssU.png')
          .setDescription(
            ` Latency is ${timestampDiff}ms. API latency is ${Math.round(
              client.ws.ping
            )}ms`
          )
      );
    });
  },
};
