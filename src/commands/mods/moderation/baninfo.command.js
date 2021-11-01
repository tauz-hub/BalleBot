import Discord from 'discord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'baninfo',
  description: `<prefix>baninfo @Usuários/TAGs/Nomes/IDs/Citações para saber o motivo de membros terem sidos banidos`,
  permissions: ['mods'],
  aliases: ['verban', 'viewban', 'banuser', 'infoban'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args, prefix }) => {
    const { users } = await getUserOfCommand(client, message, prefix);

    if (!args[0] && !users) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }

    if (users === undefined) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(Icons.erro)
          .setTitle(`Não encontrei o usuário!`)
          .setDescription(
            `**Tente usar**\`\`\`${prefix}baninfo <@Usuários/TAGs/Nomes/IDs/Citações>\`\`\``
          )
          .setFooter(
            `${message.author.tag}`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          )
          .setTimestamp()
      );
      return;
    }
    const usersBanneds = await message.guild.fetchBans();
    users.forEach(async (user) => {
      if (!usersBanneds.some((x) => x.user.id === user.id)) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle(`O usuário ${user.tag} não está banido!`)
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(Colors.pink_red)
            .setDescription(
              `**Para banir usuários use:\n\`\`${prefix}ban @Usuários/TAGs/Nomes/IDs/Citações <motivo>\`\`**`
            )
            .setTimestamp()
        );
        return;
      }
      const userBanned = usersBanneds.find((x) => x.user.id === user.id);
      const dataValidation =
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;

      const textDataTest = userBanned.reason;

      const userDataBanned = dataValidation.test(textDataTest)
        ? parseDateForDiscord(textDataTest.match(dataValidation)[0])
        : '`<Data não especificada, utilize o ballebot sempre que for banir para ter essa função>`';

      const descriptionBan = userBanned.reason
        ? userBanned.reason.replace(' — Data: ', '').replace(dataValidation, '')
        : '<Descrição ou motivo não especificado>';

      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Informações sobre o banimento do usuário: ${user.tag} `)
          .setDescription(
            `**Data: ** ${userDataBanned}\n**Descrição: ** \n${descriptionBan} \n`
          )
          .setFooter(`ID do usuário: ${user.id}`)
          .setTimestamp()
      );
    });
  },
};
