import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';

export default {
  name: 'warnlist',
  description: `${prefix}warnlist @user ou ${prefix}warnlist <tagUser> ou ${prefix}warnlist <idUser> para adicionar o chat de report do bot`,
  permissions: ['everyone'],
  aliases: ['warns'],
  category: 'Moderação ⚔️',
  run: ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message, client);
      return;
    }
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    const { user } = getUserOfCommand(client, message);

    if (!user) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Não encontrei o usuário!`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}warnlist @usuário\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }

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
            .setColor('#ff8997')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Lista de warns do usuário: `)
            .setDescription(messageCommands)
            .setFooter(`ID do usuário: ${user.id}`)
        );
        return;
      }
    }
    message.channel
      .send('usuário não encontrado no banco')
      .then((msg) => msg.delete({ timeout: 15000 }));
  },
};
