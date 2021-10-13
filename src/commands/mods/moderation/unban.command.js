import Discord from 'discord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'unban',
  description: `<prefix>unban @Usuários/TAGs/Nomes/IDs/Citações para desbanir usuários`,
  permissions: ['mods'],
  aliases: ['removeban', 'removerban', 'retirarban', 'desban'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args, prefix }) => {
    const ban = await message.guild.fetchBans();
    const { users } = await getUserOfCommand(client, message, prefix);

    if (!args[0] && !users) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      message.channel.send(
        new Discord.MessageEmbed()
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(
            'Você não tem permissão de desbanir usuários, fale com um administrador'
          )
          .setThumbnail(Icons.erro)
          .setColor(Colors.pink_red)
          .setTimestamp()
      );

      return;
    }
    if (!users) {
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
            .setTitle(`Não encontrei os usuários!`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}unban <@Usuários/TAGs/Nomes/IDs/Citações>\`\`\``
            )
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
              .setTitle(`O usuário ${member.tag} não está banido!`)
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setThumbnail(member.displayAvatarURL({ dynamic: true }))
              .setColor(Colors.pink_red)
              .setDescription(
                `**Para banir usuários use:\n\`\`${prefix}ban @Usuários/TAGs/Nomes/IDs/Citações <motivo>\`\`**`
              )
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));

        return;
      }

      message.guild.members.unban(member);

      function messageInviteLog() {
        return new Discord.MessageEmbed()
          .setTitle(`O usuário ${member.tag} foi desbanido!`)
          .setDescription(`**Pelo usuário: ${message.author}**`)
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setFooter(`ID do usuário: ${member.id}`)
          .setThumbnail(member.displayAvatarURL({ dynamic: true }))
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
