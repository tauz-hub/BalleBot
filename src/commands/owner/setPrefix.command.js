import Discord from 'discord.js';
import { helpWithASpecificCommand } from '../everyone/comandosCommon/help.command.js';
import Colors from '../../utils/layoutEmbed/colors.js';

export default {
  name: 'setPrefix',
  description: `comando setar um prefixo customizado para seu servidor, para isso use <prefix>setPrefix <novo prefix>`,
  permissions: ['everyone'],
  aliases: ['prefix', 'addPrefix'],
  category: 'Acessórios ✨',
  run: ({ message, client, args, prefix }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }

    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    guildIdDatabase.set('prefix', args[0]);
    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setTitle(`Prefixo salvo no servidor : **\`${args[0]}\`**`)
        .setFooter(
          `${message.author.tag}`,
          `${message.author.displayAvatarURL({ dynamic: true })}`
        )
        .setTimestamp()
    );
  },
};
