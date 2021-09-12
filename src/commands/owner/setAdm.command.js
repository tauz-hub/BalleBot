import Discord from 'discord.js';
import { prefix } from '../../assets/prefix.js';
import { messageErro } from '../../utils/Embeds/error.template.js';
import { helpWithASpecificCommand } from '../everyone/comandosCommon/help.command.js';

export default {
  name: 'setAdm',
  description: `Para adionar os cargos de administração use ${prefix}addRolesAdm <idPadawan> <idModeradores> <idStaff>`,
  permissions: ['owner'],
  aliases: ['addAdm', 'addRolesAdm'],
  category: 'Owner 🗡️',
  run: ({ message, client, args }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message, client);
      return;
    }
    if (!args[2]) {
      message.channel.send(message.author, messageErro(client));
      return;
    }
    const loadsToBeConsidered = [args[0], args[1], args[2]];

    loadsToBeConsidered.forEach((idrole, roleIndex) => {
      if (idrole.indexOf('@') !== -1) {
        loadsToBeConsidered[roleIndex] = idrole.replace(/(<)|(@&)|(>)/g, '');
      }
    });

    for (let i = 0; i < loadsToBeConsidered.length; i++) {
      const cargo = client.guilds.cache
        .get(message.guild.id)
        .roles.cache.get(loadsToBeConsidered[i]);
      if (!cargo) {
        message.channel.send(message.author, messageErro(client));
        return;
      }
    }
    const permissionIDs = {
      everyone: message.guild.id,
      padawans: loadsToBeConsidered[0],
      mods: loadsToBeConsidered[1],
      staff: loadsToBeConsidered[2],
    };
    guildIdDatabase.set('admIds', permissionIDs);

    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor('#ff8997')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Os Cargos Administrativos foram setados!:`)
        .setDescription(
          `**• Esses são os cargos que foram setados:**
          *Padawan:* <@&${loadsToBeConsidered[0]}>
          *Mods:* <@&${loadsToBeConsidered[1]}>
          *Staff:* <@&${loadsToBeConsidered[2]}>
          **• Todos os membros que possuem esses cargos vão ter acesso ao comandos respectivos que podem ser vistos em ${prefix}help ** `
        )
    );
  },
};
