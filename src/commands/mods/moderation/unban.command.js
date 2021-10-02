import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'unban',
  description: `${prefix}unban <idUser> ou ${prefix}unban @user para desbanir um usuário`,
  permissions: ['mods'],
  aliases: ['removeban', 'removerban', 'retirarban', 'desban'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }
    const ban = await message.guild.fetchBans();
    const { users } = getUserOfCommand(client, message);

    if (!message.member.permissions.has('BAN_MEMBERS')) {
      message.channel.send(
        new Discord.MessageEmbed()
          .setDescription(
            'Você não tem permissão de desbanir usuário, fale com um administrador'
          )
          .setThumbnail(Icons.erro)
          .setColor(Colors.pink_red)
      );

      return;
    }
    if (!users) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Não encontrei os usuários!`)
            .setDescription(`**Tente usar**\`\`\`${prefix}unban <idUser>\`\`\``)
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }

    users.forEach(async (userBanned) => {
      const member = await client.users.fetch(userBanned.id);

      if (!ban.get(member.id)) {
        message.channel
          .send(
            new Discord.MessageEmbed()
              .setDescription(`**O usuário ${member} não está banido**`)
              .setAuthor(
                `${member.tag}`,
                member.displayAvatarURL({ dynamic: true })
              )
              .setThumbnail(member.displayAvatarURL({ dynamic: true }))
              .setColor(Colors.pink_red)
          )
          .then((msg) => msg.delete({ timeout: 15000 }));

        return;
      }

      message.guild.members.unban(member);

      function messageInviteLog() {
        return new Discord.MessageEmbed()
          .setTitle(`O usuário foi desbanido com sucesso!`)
          .setAuthor(
            `${member.tag}`,
            member.displayAvatarURL({ dynamic: true })
          )
          .setThumbnail(Icons.sucess)
          .setColor(Colors.pink_red);
      }
      const guildIdDatabase = new client.Database.table(
        `guild_id_${message.guild.id}`
      );
      const channelLog = client.channels.cache.get(
        guildIdDatabase.get('channel_log')
      );

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
