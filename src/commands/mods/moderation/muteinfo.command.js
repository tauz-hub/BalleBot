import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';

export default {
  name: 'muteinfo',
  description: `${prefix}muteinfo <userId> ${prefix}muteinfo @usuário ou ${prefix}muteinfo <userTag> para saber o motivo de um membro ter sido banido`,
  permissions: ['mods'],
  aliases: ['vermute', 'viewmute', 'muteuser', 'infomute'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message, client);
      return;
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
              `**Tente usar**\`\`\`${prefix}muteinfo @usuário\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    const tableMuted = new client.Database.table(`tableMuted`);

    if (!tableMuted.has(`guild_id_${message.guild.id}_user_id_${user.id}`)) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Usuário não está mutado`)
          .setDescription(`Para mutar user ${prefix}mute @usuário`)
          .setFooter(`ID do usuário: ${user.id}`)
          .setTimestamp()
      );

      return;
    }

    const userMuted = tableMuted.get(
      `guild_id_${message.guild.id}_user_id_${user.id}`
    );

    const dataForMessage = `<t:${parseInt(
      new Date(userMuted.dateMuted).getTime() / (1000).toFixed(0),
      10
    )}:F>`;

    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor('#ff8997')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Informações sobre o mute do usuário: ${user.tag} `)
        .setDescription(
          `**Data final do Mute:** ${dataForMessage}\n**Descrição:**\`\`\`${userMuted.reason}\`\`\``
        )
        .setFooter(`ID do usuário: ${userMuted.id}`)
        .setTimestamp()
    );
  },
};
