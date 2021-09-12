/* eslint-disable no-param-reassign */
import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';

export default {
  name: 'addLog',
  description: `${prefix}addLog para adicionar o chat de report do bot`,
  permissions: ['mods'],
  aliases: ['addChannelLog', 'setlog'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message, client);
      return;
    }
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    args[0] = args[0].replace('<#', '').replace('>', '');

    const channel = client.channels.cache.get(args[0]);
    if (!channel) {
      message.channel.send('canal não existe');
      return;
    }
    guildIdDatabase.set('channel_log', args[0]);

    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor('#ff8997')
        .setThumbnail('https://i.imgur.com/gfDpssU.png')
        .setTitle(
          `${message.author.tag} O Chat Log foi atualizado com sucesso: `
        )
        .setDescription(`Chat setado: ${channel}`)
    );
  },
};
