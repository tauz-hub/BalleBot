import Discord from 'discord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import Icons from '../../../utils/icons/iconsMessage.js';

export default {
  name: 'unmute',
  description: `${prefix}unmute <userId> ou ${prefix}unmute @usuário ou ${prefix}unmute <userTag>`,
  permissions: ['mods'],
  aliases: ['tirarmute', 'desmutar', 'desmute'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message, client);
    }

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
              `**Tente usar**\`\`\`${prefix}mute @usuário <motivo> <tempo>\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    if (!message.member.hasPermission('MANAGE_ROLES')) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Você não tem permissão para desmutar o usuário`)
            .setTitle(`Peça para um cargo maior desmutar o membro`)
            .setFooter(`ID do usuário : ${user.id}`)
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    const tableMuted = new client.Database.table(`tableMuted`);

    if (!tableMuted.has(`guild_id_${message.guild.id}_user_id_${user.id}`)) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription(
              `O usuário ${user} não está mutado no servidor, para mutar user ${prefix}mute <idUser> <motivo> <tempo>`
            )
            .setTitle(`Usuário não está mutado`)
            .setFooter(`ID do usuário : ${user.id}`)
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    const userMuted = tableMuted.get(
      `guild_id_${message.guild.id}_user_id_${user.id}`
    );

    const userMember = client.guilds.cache
      .get(userMuted.guildId)
      .members.cache.get(userMuted.id);

    userMember.roles.remove(userMuted.roleId);
    tableMuted.delete(`guild_id_${userMuted.guildId}_user_id_${userMuted.id}`);

    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );
    const channelLog = client.channels.cache.get(
      guildIdDatabase.get('channel_log')
    );

    function messageInviteLog() {
      return new Discord.MessageEmbed()
        .setTitle(`Usuário desmutado com sucesso`)
        .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(Icons.unmute)
        .setColor('#ff8997');
    }
    if (channelLog) {
      channelLog.send(message.author, messageInviteLog());
    } else {
      message.channel
        .send(message.author, messageInviteLog())
        .then((msg) => msg.delete({ timeout: 15000 }));
    }
  },
};
