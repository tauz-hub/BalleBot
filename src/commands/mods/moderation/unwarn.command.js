import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';

export default {
  name: 'unwarn',
  description: `${prefix}unwarn <idUser> <aviso1> ou ${prefix}unwarn @user <aviso1> ou ${prefix}unwarn <tagUser> <aviso1>`,
  permissions: ['mods'],
  aliases: ['removewarn', 'removerwarn', 'retirarwarn', 'deswarn'],
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
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Não encontrei o usuário!`)
          .setDescription(
            `**Tente usar**\`\`\`${prefix}unwarn @usuário <aviso 1 >\`\`\``
          )
          .setTimestamp()
      );
      return;
    }

    const memberUser = client.guilds.cache
      .get(message.guild.id)
      .members.cache.get(user.id);
    if (
      memberUser.roles.highest.position >= message.member.roles.highest.position
    ) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Você não tem permissão para remover o aviso do usuário`)
            .setDescription(
              `Você não possui um cargo maior que o usuário ${user.tag} para remover os avisos dele`
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
    } else {
      const warnRemove = isNaN(args[args.length - 1])
        ? args[args.length - 1]
        : Number(args[args.length - 1]) - 1;

      if (guildIdDatabase.has(`user_id_${user.id}`)) {
        if (!args[1]) {
          return message.channel.send(
            'selecione um aviso que existe: ex. aviso1 returnnn'
          );
        }

        if (isNaN(warnRemove)) {
          if (warnRemove.toLowerCase() === 'all') {
            guildIdDatabase.delete(`user_id_${user.id}.reasons`);
            guildIdDatabase.delete(`user_id_${user.id}.dataReasonsWarns`);
            guildIdDatabase.set(`user_id_${user.id}.warnsCount`, 0);
            guildIdDatabase.set(`user_id_${user.id}.reasons`, []);

            message.channel
              .send(
                message.author,
                new Discord.MessageEmbed()
                  .setColor('#ff8997')
                  .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                  .setTitle(
                    `Todos os avisos foram removidos do usuário ${user.tag}`
                  )
                  .setDescription(`**O usuário não possui avisos**`)
                  .setFooter(`ID do usuário: ${user.id}`)
                  .setTimestamp()
              )
              .then((msg) => msg.delete({ timeout: 15000 }));
            return;
          }

          return message.channel.send(
            'selecione um aviso que existe: ex. aviso1'
          );
        }

        const reasons = guildIdDatabase.get(`user_id_${user.id}.reasons`);
        const dates = guildIdDatabase.get(
          `user_id_${user.id}.dataReasonsWarns`
        );

        if (reasons.length !== 0) {
          if (warnRemove > reasons.length) {
            return message.channel.send(
              `este usuário não possui o aviso ${warnRemove + 1}`
            );
          }

          const avisoDeleted = reasons[warnRemove];
          const dataDeleted = dates[warnRemove];
          reasons.splice(warnRemove, 1);
          dates.splice(warnRemove, 1);

          guildIdDatabase.delete(`user_id_${user.id}.reasons`);
          guildIdDatabase.set(`user_id_${user.id}.reasons`, reasons);
          guildIdDatabase.delete(`user_id_${user.id}.dataReasonsWarns`);
          guildIdDatabase.set(`user_id_${user.id}.dataReasonsWarns`, dates);
          guildIdDatabase.subtract(`user_id_${user.id}.warnsCount`, 1);

          const channelLog = client.channels.cache.get(
            guildIdDatabase.get('channel_log')
          );
          if (channelLog) {
            channelLog.send(
              message.author,
              new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(
                  `O usuário ${user.tag} teve um aviso removido! \n
                    **Data:** ${parseDateForDiscord(dataDeleted)}
                    **Motivo** ${avisoDeleted}
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
                  .setColor('#ff8997')
                  .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                  .setDescription(
                    `O usuário ${user.tag} teve um aviso removido! \n
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

        message.channel.send('este usuário não possui avisos');
        return;
      }
      message.channel.send('usuário não encontrado no banco');
    }
  },
};
