import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';

export default {
  name: 'test',
  description: `customizando ${prefix}`,
  permissions: ['everyone'],
  aliases: [],
  dm: true,
  category: 'Utility ⛏️',
  run: ({ message }) => {
    const exampleEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Some title')
      .setURL('https://discord.js.org/')
      .setAuthor(
        'Some name',
        'https://i.imgur.com/AfFp7pu.png',
        'https://discord.js.org'
      )
      .setDescription('Some description here')
      .setThumbnail('https://i.imgur.com/7CGXs55.png')
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true }
      )
      .addField('Inline field title', 'Some value here', true)
      .setImage('https://i.imgur.com/AfFp7pu.png')
      .setTimestamp()
      .setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

    message.channel.send(exampleEmbed);
  },
};
