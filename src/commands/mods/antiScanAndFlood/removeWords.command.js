import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';

export default {
  name: 'removewords',
  description: `${prefix}removewords para remover palavras proibidas no servidor`,
  permissions: ['mods'],
  aliases: ['rmvwords'],
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
          .setColor('#ff8997')
          .setThumbnail('https://i.imgur.com/9UyP0xw.png')
          .setTitle(
            `${message.author.tag} As Palavras ou Links foram removidos do banco com sucesso! `
          )
          .setDescription(
            `**Essas foram as palavras ou links removidos:** \n\`\`\`${deleteRegexList.join(
              ' | '
            )}\`\`\``
          )
      );
    } else {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(
            `${message.author.tag} O seu servidor não possui um banco para excluir palavras e links proibidos`
          )
          .setDescription(
            `Para usar o comando primeiro adicione palavras no banco com o ${prefix}addwords <palavra1> <palavra2> <palavra3> etc`
          )
      );
    }
  },
};
