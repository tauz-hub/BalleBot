import Discord from 'discord.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'ping',
  description: `comando de ping para saber a latência, para usar digite <prefix>ping`,
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
          .setColor(Colors.pink_red)
          .setThumbnail(Icons.wifi)
          .setTitle(`🏓Pong!`)
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(
            `A sua latência é ${timestampDiff}ms. A latência da API é ${Math.round(
              client.ws.ping
            )}ms`
          )
          .setTimestamp()
      );
    });
  },
};
