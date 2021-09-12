import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';

function bouncer(array) {
  const filterArray = array.filter((item) => {
    return Boolean(item);
  });

  return filterArray;
}

export default {
  name: 'words',
  description: `${prefix}words para ver mensagens proibidas no servidor`,
  permissions: ['mods'],
  aliases: ['viewwords', 'words?', 'wordsremove'],
  dm: true,
  category: 'AntiSpam ⚠️',
  run: ({ message, client }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    if (guildIdDatabase.has('wordsBanned')) {
      const listOfWords = bouncer(guildIdDatabase.get('wordsBanned')).sort();

      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setThumbnail('https://i.imgur.com/gcW4DRj.png')
          .setTitle(
            `${message.author.tag} Aqui está todas as palavras do banco de dados: `
          )
          .setDescription(`\`\`\`${listOfWords.join(' | ')}\`\`\``)
      );
    } else {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setTitle(`${message.author.tag} Seu servidor não foi encontrado: `)
          .setDescription(
            `Para ativar o sistema de words primeiro adicione palavras com ${prefix}addwords <palavra1> <palavra2> <palavra3> etc...
            \nPara configurar onde os reports irão ser mandados
            \nPara mais detalhes consulte o comando addlog no ${prefix}help addwords`
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      );
    }
  },
};
