import Discord from 'discord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import Colors from '../../../utils/layoutEmbed/colors.js';

export default {
  name: 'unmute',
  description: `<prefix>unmute @usuário/TAG/ID para desmutar usuários`,
  permissions: ['mods'],
  aliases: ['tirarmute', 'desmutar', 'desmute'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args, prefix }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
    }
    if (!message.member.hasPermission('MANAGE_ROLES')) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Você não tem permissão para desmutar usuários`)
            .setTitle(`Peça para um cargo maior desmutar o membro`)

            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    const { users } = getUserOfCommand(client, message, prefix);

    if (!users) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Não encontrei o usuário!`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}mute @usuário <motivo> <tempo>\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    const tableTemporarilyMutated = new client.Database.table(
      `tableTemporarilyMutated`
    );
    const guildUndefinedMutated = new client.Database.table(
      `guild_users_mutated_${message.guild.id}`
    );
    users.forEach(async (user) => {
      const userMuted =
        tableTemporarilyMutated.get(
          `guild_id_${message.guild.id}_user_id_${user.id}`
        ) || guildUndefinedMutated.get(`user_id_${user.id}`);

      if (!userMuted) {
        message.channel
          .send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(user.displayAvatarURL({ dynamic: true }))
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setDescription(
                `O usuário ${user} não está mutado no servidor, para mutar use ${prefix}mute @usuário/TAG/ID <motivo> <tempo/2d 5h 30m 12s>`
              )
              .setTitle(`Usuário não está mutado`)
              .setFooter(`ID do usuário : ${user.id}`)
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
        return;
      }

      if (guildUndefinedMutated.has(`user_id_${user.id}`)) {
        guildUndefinedMutated.delete(`user_id_${user.id}`);
      } else if (
        tableTemporarilyMutated.has(
          `guild_id_${message.guild.id}_user_id_${user.id}`
        )
      ) {
        tableTemporarilyMutated.delete(
          `guild_id_${message.guild.id}_user_id_${user.id}`
        );
      }
      const userMember = client.guilds.cache
        .get(userMuted.guildId)
        .members.cache.get(userMuted.id);

      userMember.roles.remove(userMuted.roleId);
      const guildIdDatabase = new client.Database.table(
        `guild_id_${message.guild.id}`
      );
      const channelLog = client.channels.cache.get(
        guildIdDatabase.get('channel_log')
      );
      console.log(userMember);
      function messageInviteLog() {
        return new Discord.MessageEmbed()
          .setTitle(`Usuário ${userMember.user.tag} foi desmutado!`)
          .setFooter(`ID do usuário: ${userMember.user.id}`)
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setThumbnail(userMember.user.displayAvatarURL({ dynamic: true }))
          .setColor(Colors.pink_red)
          .setTimestamp();
      }
      if (channelLog) {
        channelLog.send(message.author, messageInviteLog());
      } else {
        message.channel
          .send(message.author, messageInviteLog())
          .then((msg) => msg.delete({ timeout: 15000 }));
      }
    });
  },
};
