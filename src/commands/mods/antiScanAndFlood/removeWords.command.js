import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

function allNull(arrayT) {
  return !arrayT.some((elementT) => elementT !== null);
}

export default {
  name: 'removewords',
  description: `${prefix}removewords para remover palavras proibidas no servidor`,
  permissions: ['mods'],
  aliases: ['rmvwords', 'wordsremove', 'removerPalavras'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client, args }) => {
    const deleteRegexList = [];
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    for (let i = 0; i < args.length; i++) {
      deleteRegexList.push(args[i].toLowerCase());
    }

    if (guildIdDatabase.has('wordsBanned')) {
      const listRegexInDatabase = guildIdDatabase.get('wordsBanned');
      if (!allNull(listRegexInDatabase)) {
        for (let i = 0; i < deleteRegexList.length; i++) {
          for (let j = 0; j < listRegexInDatabase.length; j++) {
            if (deleteRegexList[i] === listRegexInDatabase[j]) {
              guildIdDatabase.delete(`wordsBanned.${j}`);
            }
          }
        }

        message.channel.send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(Icons.subwords)
            .setTitle(
              `As Palavras ou Links foram **removidos** do banco com sucesso! `
            )
            .setDescription(
              `**Essas foram as palavras ou links removidos:** \n> ${deleteRegexList.join(
                ' **|** '
              )}`
            )
            .setFooter(
              `${message.author.tag}`,
              `${message.author.displayAvatarURL({ dynamic: true })}`
            )
            .setTimestamp()
        );
        return;
      }
    }
    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(
          `O seu servidor **não possui** um banco para excluir palavras e links proibidos`
        )
        .setDescription(
          `**Para usar o comando:**\n> primeiro adicione palavras no banco com o comando:\n>\`${prefix}addwords <palavra1> <palavra2> <palavra3> etc \``
        )
        .setFooter(
          `${message.author.tag}`,
          `${message.author.displayAvatarURL({ dynamic: true })}`
        )
        .setTimestamp()
    );
  },
};
