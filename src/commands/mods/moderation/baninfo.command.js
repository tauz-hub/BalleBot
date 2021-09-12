import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';

export default {
  name: 'baninfo',
  description: `${prefix}baninfo <userId> ${prefix}baninfo @usuário para saber o motivo de um membro ter sido banido`,
  permissions: ['mods'],
  aliases: ['verban', 'viewban', 'banuser', 'infoban'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message, client);
      return;
    }
    const { user } = getUserOfCommand(client, message);

    const userBanned = await message.guild
      .fetchBans()
      .then((x) => x.get(user.id));

    if (!userBanned) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Não encontrei o usuário!`)
          .setDescription(
            `**Tente usar**\`\`\`${prefix}baninfo <idUser> ou ${prefix}baninfo @usuário\`\`\``
          )
          .setTimestamp()
      );
      return;
    }

    const dataValidation =
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;
    const textDataTest = userBanned.reason;

    const userDataBanned = dataValidation.test(textDataTest)
      ? `**<t:${parseInt(
          (
            new Date(textDataTest.match(dataValidation)[0]).getTime() / 1000
          ).toFixed(0),
          10
        )}:F>**`
      : '`<Data não especificada, utilize o ballebot sempre que for banir para ter essa função>`';

    const descriptionBan = userBanned.reason
      ? userBanned.reason.replace(' — Data: ', '').replace(dataValidation, '')
      : '<Descrição ou motivo não especificado>';

    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor('#ff8997')
        .setThumbnail(userBanned.user.displayAvatarURL({ dynamic: true }))
        .setTitle(
          `Informações sobre o banimento do usuário: ${`${userBanned.user.username}#${userBanned.user.discriminator}`} `
        )
        .setDescription(
          `**Data:** ${userDataBanned}\n**Descrição:**\`\`\`${descriptionBan}\`\`\``
        )
        .setFooter(`ID do usuário: ${userBanned.user.id}`)
        .setTimestamp()
    );
  },
};
