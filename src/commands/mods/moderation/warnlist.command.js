import Discord from 'discord.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'warnlist',
  description: `<prefix>warnlist @Usuários/TAGs/Nomes/IDs/Citações para ver os warns de um usuários`,
  permissions: ['everyone'],
  aliases: ['warns'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args, prefix }) => {
    const { users } = await getUserOfCommand(client, message, prefix);

    if (!args[0] && users.length === 0) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }

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
              `**Tente usar**\`\`\`${prefix}warnlist @Usuários/TAGs/Nomes/IDs/Citações\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    users.forEach(async (user) => {
      if (guildIdDatabase.has(`user_id_${user.id}`)) {
        const myUser = guildIdDatabase.get(`user_id_${user.id}`);
        const warnsUser = myUser.reasons;

        if (warnsUser) {
          const messageCommands = warnsUser.reduce(
            (previous, current, index) =>
              `${previous}**Aviso ${index + 1}:** \n**Punido por: <@${
                myUser.autor[index]
              }>** \n **Data: ${parseDateForDiscord(
                myUser.dataReasonsWarns[index]
              )}** \n **Motivo:** \n ${current}\n\n`,
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
              .setTimestamp()
          );
          return;
        }
      }
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(Icons.erro)
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setFooter(`ID do usuário: ${user.id}`)
          .setDescription(
            `**Para avisar alguém, use o comando \n\`\`${prefix}warn @Usuários/TAGs/Nomes/IDs/Citações <motivo>\`\`**`
          )
          .setTitle(`O Usuário ${user.tag} não possui avisos`)
          .setTimestamp()
      );
    });
  },
};
