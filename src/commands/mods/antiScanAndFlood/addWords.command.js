import Discord from 'discord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'addwords',
  description: `<prefix>words para ver mensagens proibidas no servidor`,
  permissions: ['mods'],
  aliases: ['setwords'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client, args, prefix }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    if (!guildIdDatabase.has('channel_log')) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(Icons.chat)
          .setTitle(
            `O seu servidor não possui um chat log para usar esse recurso!`
          )
          .setDescription(
            `> Use **${prefix}addlog <#chat/ID>** para adicionar o canal de **configurações**!`
          )
          .setFooter(
            `${message.author.tag}`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          )
          .setTimestamp()
      );
      return;
    }

    const setRegexList = [];
    let position = 0;

    for (let i = 0; i < args.length; i++) {
      setRegexList.push(args[i].toLowerCase());
    }

    function messageSucess() {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(Icons.sucess)
          .setTitle(`As Palavras ou Links foram **adicionados** ao banco!`)
          .setDescription(
            `**Essas foram as palavras ou links adicionados:** \n> ${args.join(
              ' **|** '
            )}`
          )
          .setFooter(
            `${message.author.tag}`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          )
          .setTimestamp()
      );
    }
    if (guildIdDatabase.has('listOfWordsBanned')) {
      const listRegexInDatabase = guildIdDatabase.get('listOfWordsBanned');

      for (let i = 0; i < setRegexList.length; i++) {
        for (let j = 0; j < listRegexInDatabase.length; j++) {
          if (setRegexList[i] === listRegexInDatabase[j]) {
            setRegexList.splice(i, 1);
          }
        }
      }

      for (let j = 0; j < listRegexInDatabase.length; j++) {
        if (listRegexInDatabase[j] === null) {
          if (setRegexList[position]) {
            guildIdDatabase.set(
              `listOfWordsBanned.${j}`,
              setRegexList[position]
            );
            position++;
          }
        }
      }

      for (let i = position; i < setRegexList.length - position; i++) {
        guildIdDatabase.push('listOfWordsBanned', setRegexList[i]);
      }
      messageSucess();
    } else {
      guildIdDatabase.set('listOfWordsBanned', setRegexList);
      messageSucess();
    }
  },
};
