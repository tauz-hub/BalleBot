import Discord from 'discord.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'warnlist',
  description: `<prefix>warnlist @usuário/TAG/ID para ver os warns de um usuários`,
  permissions: ['everyone'],
  aliases: ['warns'],
  category: 'Moderação ⚔️',
  run: ({ message, client, args, prefix }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    const { users } = getUserOfCommand(client, message, prefix);

    if (!users) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(Icons.erro)
            .setTitle(`Não encontrei os usuários!`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}warnlist @usuário/TAG/ID\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    users.forEach(async (user) => {
      if (guildIdDatabase.has(`user_id_${user.id}`)) {
        const myUser = guildIdDatabase.get(`user_id_${user.id}`);
        const warnsUser = myUser.reasons;

        if (warnsUser) {
          const messageCommands = warnsUser.reduce(
            (previous, current, index) =>
              `${previous}**Aviso ${
                index + 1
              }:** \n **Data: ${parseDateForDiscord(
                myUser.dataReasonsWarns[index]
              )}** \n **Motivo:** \n \`\`\`${current}\`\`\`\n\n`,
            ''
          );

          message.channel.send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(user.displayAvatarURL({ dynamic: true }))
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`Lista de warns do usuário ${user.tag}`)
              .setDescription(messageCommands)
              .setFooter(`ID do usuário: ${user.id}`)
          );
          return;
        }
      }
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(Icons.erro)
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )

            .setTitle(`O Usuário ${user.tag} não possui avisos`)
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
    });
  },
};
