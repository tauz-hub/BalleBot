/* eslint-disable no-param-reassign */
import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'addLog',
  description: `${prefix}addLog para adicionar o chat de report do bot`,
  permissions: ['mods'],
  aliases: ['addChannelLog', 'setlog'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    args[0] = args[0].replace('<#', '').replace('>', '');

    const channel = client.channels.cache.get(args[0]);
    if (!channel) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(Icons.erro)
          .setTitle('**Não encontrei o chat!**')
          .setDescription(
            '> Tente mencionar o chat com **#chat** ou use o **ID** do chat para adicionar e receber notificações sobre configurações, banimentos, avisos e muito mais!'
          )
          .setFooter(
            `${message.author.tag}`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          )
          .setTimestamp()
      );
      return;
    }
    guildIdDatabase.set('channel_log', args[0]);

    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setThumbnail(Icons.sucess)
        .setTitle(`O Chat Log foi atualizado com sucesso: `)
        .setDescription(
          `Caso queira modificar basta usar o comando novamente com **outro chat!**\n> **Chat setado:** ${channel}`
        )
        .setFooter(
          `${message.author.tag}`,
          `${message.author.displayAvatarURL({ dynamic: true })}`
        )
    );
  },
};
