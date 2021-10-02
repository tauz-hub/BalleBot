import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

function removeWordsNull(array) {
  const filterArray = array.filter((item) => {
    return Boolean(item);
  });

  return filterArray;
}

export default {
  name: 'words',
  description: `${prefix}words para ver mensagens proibidas no servidor`,
  permissions: ['mods'],
  aliases: ['viewwords', 'words?'],
  dm: true,
  category: 'AntiSpam ⚠️',
  run: ({ message, client }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    if (guildIdDatabase.has('listOfWordsBanned')) {
      const listOfWords = removeWordsNull(
        guildIdDatabase.get('listOfWordsBanned')
      ).sort();
      if (listOfWords.lenght > 0) {
        message.channel.send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(Icons.words)
            .setTitle('Banco encontrado')
            .setDescription(
              `**Aqui está todas as palavras do banco de dados:**\n> ${listOfWords.join(
                ' **|** '
              )}\nCaso queira adicionar ou remover alguma palavra use os comando de addWords e removeWords`
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
        .setTitle(`Seu servidor não foi encontrado: `)
        .setDescription(
          `**Para ativar o sistema de Forbbiden Words primeiro adicione palavras com o comando:**\n> \`${prefix}addwords <palavra1> <palavra2> <palavra3> etc...\`
            \n**Para configurar onde os report's irão ser mandados:**\n> \`${prefix}addlog <#chat/ID>\`
            \n**Para mais detalhes consulte o comando addwords:** \n> \`${prefix}help addwords\``
        )
        .setThumbnail(Icons.erro)
        .setFooter(
          `${message.author.tag}`,
          `${message.author.displayAvatarURL({ dynamic: true })}`
        )
        .setTimestamp()
    );
  },
};
