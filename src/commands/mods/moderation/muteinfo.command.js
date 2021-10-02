import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import Colors from '../../../utils/layoutEmbed/colors.js';

export default {
  name: 'muteinfo',
  description: `${prefix}muteinfo <userId> ${prefix}muteinfo @usuário ou ${prefix}muteinfo <userTag> para saber o motivo de um membro ter sido banido`,
  permissions: ['mods'],
  aliases: ['vermute', 'viewmute', 'muteuser', 'infomute'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }
    const { users } = getUserOfCommand(client, message);
    //  console.log(users);
    // console.log('comando muteinfo : ', users);

    if (!users) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Não encontrei o usuário !`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}muteinfo @usuário\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    users.forEach((user) => {
      const tableTemporarilyMutated = new client.Database.table(
        `tableTemporarilyMutated`
      );
      const guildUndefinedMutated = new client.Database.table(
        `guild_users_mutated_${message.guild.id}`
      );

      const userMuted =
        tableTemporarilyMutated.get(
          `guild_id_${message.guild.id}_user_id_${user.id}`
        ) || guildUndefinedMutated.get(`user_id_${user.id}`);

      function messageUserNotMutated() {
        return message.channel.send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Usuário ${user.tag} não está mutado`)
            .setDescription(`Para mutar use ${prefix}mute @usuário`)
            .setFooter(`ID do usuário: ${user.id}`)
            .setTimestamp()
        );
      }
      if (!userMuted) {
        messageUserNotMutated();
        return;
      }
      const muterole = message.guild.roles.cache.find(
        (muteroleObj) => muteroleObj.name === 'muted'
      );
      const userHasRoleMuted = client.guilds.cache
        .get(message.guild.id)
        .members.cache.get(userMuted.id)
        .roles.cache.some((role) => role.id === muterole.id);

      if (userHasRoleMuted) {
        const dataForMessage = userMuted.dateMuted
          ? parseDateForDiscord(userMuted.dateMuted)
          : '`<indefinida>`';

        message.channel.send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Informações sobre o mute do usuário: ${user.tag} `)
            .setDescription(
              `**Data final do Mute:** ${dataForMessage}\n**Descrição:**\`\`\`${userMuted.reason}\`\`\``
            )
            .setFooter(`ID do usuário: ${userMuted.id}`)
            .setTimestamp()
        );
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
      messageUserNotMutated();
    });
  },
};
