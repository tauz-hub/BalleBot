import Discord from 'discord.js';

import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from './confirmMessage.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';
import Colors from '../../../utils/layoutEmbed/colors.js';

export default {
  name: 'warn',
  description: `${prefix}warn <userId> <motivo> ou ${prefix}warn @usuário <motivo> ou ${prefix}warn <userTag> <motivo>`,
  permissions: ['mods'],
  aliases: ['addwarn', 'advertencia', 'avisar'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }

    const { users, restOfMessage } = getUserOfCommand(client, message);

    if (!users) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(Icons.erro)
            .setTitle(`Não encontrei o usuário!`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}warn @usuário <motivo>\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }

    const reason = restOfMessage || '<Motivo não especificado>';

    const messageAnt = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setThumbnail(Icons.warn)

        .setTitle(`Você está preste a avisar os Usuários ${users}`)
        .setDescription(
          `**Pelo Motivo de : **\n\n\`\`\`${reason}\`\`\` \nPara confirmar clique em ✅\n para cancelar clique em ❎`
        )

        .setTimestamp()
    );

    if (await confirmMessage(message, messageAnt)) {
      messageAnt.delete();

      const guildIdDatabase = new client.Database.table(
        `guild_id_${message.guild.id}`
      );

      const channelLog = client.channels.cache.get(
        guildIdDatabase.get('channel_log')
      );

      users.forEach(async (user) => {
        const memberUser = client.guilds.cache
          .get(message.guild.id)
          .members.cache.get(user.id);
        if (user.id === message.guild.me.id) {
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setThumbnail(Icons.erro)
                .setColor(Colors.pink_red)
                .setTitle(
                  `Hey, você não pode avisar eu mesma, isso não é legal :(`
                )
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }));
          return;
        }
        if (
          memberUser.roles.highest.position >=
          message.member.roles.highest.position
        ) {
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setThumbnail(Icons.erro)
                .setTitle(`Você não tem permissão para avisar o usuário`)
                .setDescription(
                  `O usuário ${user} está acima ou no mesmo cargo que você, por isso não podes adicionar um aviso a ele`
                )
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }));
          return;
        }

        if (channelLog) {
          channelLog.send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(Icons.sucess)
              .setTitle(`O usuário ${user.tag} foi avisado!`)
              .addFields(
                {
                  name: '**Motivo: **',
                  value: `\n\n\`\`\`${reason}\`\`\``,
                },
                {
                  name: '**Aplicadado por:**',
                  value: `${message.author} - ${message.author.id}`,
                }
              )
              .setFooter(`ID do usuário avisado: ${user.id}`)
              .setTimestamp()
          );
        } else {
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setThumbnail(Icons.sucess)
                .setTitle(`O usuário ${user.tag} foi avisado!`)
                .addFields(
                  {
                    name: '**Motivo: **',
                    value: `\n\n\`\`\`${reason}\`\`\``,
                  },
                  {
                    name: '**Aplicadado por:**',
                    value: `${message.author} - ${message.author.id}`,
                  }
                )
                .setFooter(`ID do usuário avisado: ${user.id}`)
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }));
        }
        if (guildIdDatabase.has(`user_id_${user.id}`)) {
          guildIdDatabase.set(`user_id_${user.id}.name`, user.username);
          guildIdDatabase.set(
            `user_id_${user.id}.discriminator`,
            user.discriminator
          );

          guildIdDatabase.add(`user_id_${user.id}.warnsCount`, 1);
          guildIdDatabase.push(`user_id_${user.id}.reasons`, reason);
          guildIdDatabase.push(
            `user_id_${user.id}.dataReasonsWarns`,
            new Date()
          );
        } else {
          guildIdDatabase.set(`user_id_${user.id}`, {
            name: user.username,
            discriminator: user.discriminator,
            id: user.id,
            warnsCount: 1,
            reasons: [reason],
            dataReasonsWarns: [new Date()],
          });
        }

        user
          .send(
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setTitle(
                `Você recebeu um warn do servidor **${message.guild.name}**`
              )
              .setDescription(
                `**Motivo: **\n\`\`\`${reason}\`\`\`\n**Aplicada por: ${message.author.tag}**`
              )
              .setFooter(`ID do usuário: ${user.id}`)
              .setTimestamp()
          )
          .catch(() =>
            message.channel
              .send(
                message.author,
                new Discord.MessageEmbed()
                  .setColor(Colors.pink_red)
                  .setThumbnail(Icons.erro)
                  .setDescription(
                    `O usuário ${user} possui a DM fechada, por isso não pude avisá-lo`
                  )
                  .setTitle(`Não foi possível avisar na DM do usuário!`)
                  .setTimestamp()
              )
              .then((msg) => msg.delete({ timeout: 15000 }))
          );
      });
    } else {
      await messageAnt.delete();
    }
  },
};
