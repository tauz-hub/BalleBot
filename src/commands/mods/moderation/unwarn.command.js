import Discord from 'discord.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'unwarn',
  description: `<prefix>unwarn @Usuários/TAGs/Nomes/IDs/Citações <aviso1/ 1 / aviso 1> para remover um aviso de usuários`,
  permissions: ['mods'],
  aliases: ['removewarn', 'removerwarn', 'retirarwarn', 'deswarn'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args, prefix }) => {
    const { users } = await getUserOfCommand(client, message, prefix);

    if (!args[0] && users.length === 0) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }

    if (!users) {
      message.channel.send(
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
            `**Tente usar**\`\`\`${prefix}unwarn @Usuários/TAGs/Nomes/IDs/Citações <aviso 1>\`\`\``
          )
          .setTimestamp()
      );
      return;
    }

    function messageSelectWarn() {
      return new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setThumbnail(Icons.erro)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`Selecione um aviso!`)
        .setDescription(
          `**Você pode usar:\n\`\`${prefix}unwarn @Usuários/TAGs/Nomes/IDs/Citações aviso 1\`\`**`
        )
        .setTimestamp();
    }
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );
    users.forEach(async (user) => {
      const memberUser = client.guilds.cache
        .get(message.guild.id)
        .members.cache.get(user.id);
      if (
        memberUser.roles.highest.position >=
        message.member.roles.highest.position
      ) {
        message.channel.send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(Icons.erro)
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(
              `Você não tem permissão para remover o aviso do usuário ${user.tag}`
            )
            .setDescription(
              `**Você não possui um cargo maior que o usuário ${user.tag} para remover os avisos dele, fale com um moderador maior**`
            )
            .setFooter(`ID do usuário: ${user.id}`)
            .setTimestamp()
        );

        return;
      }
      const warnRemove = isNaN(args[args.length - 1])
        ? args[args.length - 1]
        : Number(args[args.length - 1]) - 1;

      if (guildIdDatabase.has(`user_id_${user.id}`)) {
        if (!args[1]) {
          return message.channel.send(message.author, messageSelectWarn());
        }

        if (isNaN(warnRemove)) {
          if (warnRemove.toLowerCase() === 'all') {
            guildIdDatabase.delete(`user_id_${user.id}`);

            message.channel.send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL({ dynamic: true })
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(
                  `Todos os avisos foram removidos do usuário ${user.tag}!`
                )
                .setDescription(`**O usuário não possui mais avisos**`)
                .setFooter(`ID do usuário: ${user.id}`)
                .setTimestamp()
            );

            return;
          }

          return message.channel.send(message.author, messageSelectWarn());
        }

        const reasons = guildIdDatabase.get(`user_id_${user.id}.reasons`);
        const dates = guildIdDatabase.get(
          `user_id_${user.id}.dataReasonsWarns`
        );
        const autors = guildIdDatabase.get(`user_id_${user.id}.autor`);

        if (reasons.length !== 0) {
          if (warnRemove > reasons.length) {
            return message.channel.send(
              `este usuário não possui o aviso ${warnRemove + 1}`
            );
          }

          const avisoDeleted = reasons[warnRemove];
          const dataDeleted = dates[warnRemove];
          const autorDeleted = autors[warnRemove];
          reasons.splice(warnRemove, 1);
          dates.splice(warnRemove, 1);
          autors.splice(warnRemove, 1);

          guildIdDatabase.delete(`user_id_${user.id}.reasons`);
          guildIdDatabase.set(`user_id_${user.id}.reasons`, reasons);
          guildIdDatabase.delete(`user_id_${user.id}.dataReasonsWarns`);
          guildIdDatabase.set(`user_id_${user.id}.dataReasonsWarns`, dates);
          guildIdDatabase.delete(`user_id_${user.id}.autor`);
          guildIdDatabase.set(`user_id_${user.id}.autor`, autors);

          const channelLog = client.channels.cache.get(
            guildIdDatabase.get('channel_log')
          );
          if (channelLog) {
            channelLog.send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL({ dynamic: true })
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(
                  `O usuário ${user.tag} teve um aviso removido! \n
                    **Punido por**: ${autorDeleted}\n
                    **Data:** ${parseDateForDiscord(dataDeleted)}
                    **Motivo:**\n ${avisoDeleted}
                    `
                )
                .setTitle(
                  `Aviso ${warnRemove + 1} foi removido do usuário ${user.tag}`
                )
                .setTimestamp()
            );
          } else {
            message.channel
              .send(
                message.author,
                new Discord.MessageEmbed()
                  .setColor(Colors.pink_red)
                  .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                  )
                  .setDescription(
                    `O usuário ${user.tag} teve um aviso removido! \n
                    **Punido por**: ${autorDeleted}\n
                    **Data:** ${parseDateForDiscord(dataDeleted)}
                    **Motivo** ${avisoDeleted}
                    `
                  )
                  .setTitle(
                    `Aviso ${warnRemove + 1} foi removido do usuário ${
                      user.tag
                    }`
                  )
                  .setTimestamp()
              )
              .then((msg) => msg.delete({ timeout: 15000 }));
          }
          return;
        }
      }
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(
            `**Para avisar alguém, use o comando \n\`\`${prefix}warn @Usuários/TAGs/Nomes/IDs/Citações <motivo>\`\`**`
          )
          .setTitle(`O Usuário ${user.tag} não possui avisos`)
          .setTimestamp()
      );
    });
  },
};
