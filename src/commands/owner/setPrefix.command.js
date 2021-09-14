import { prefix } from '../../assets/prefix.js';
import { helpWithASpecificCommand } from '../everyone/comandosCommon/help.command.js';

export default {
  name: 'setPrefix',
  description: `comando setar um prefixo customizado para seu servidor, para isso use ${prefix}setPrefix <prefix>`,
  permissions: ['everyone'],
  aliases: ['prefix'],
  category: 'Acessórios ✨',
  run: ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
    }

    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    guildIdDatabase.set('prefix', args[0]);
    message.channel.send(
      `prefix foi setado: \`${args[0]}\`\n obs: o bot ainda não funciona com o prefix do servidor`
    );
  },
};
