import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from './confirmMessage.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';
import Colors from '../../../utils/layoutEmbed/colors.js';

export default {
  name: 'ban',
  description: `${prefix}ban <userId> ou ${prefix}ban @usuário ou ${prefix}warn <userTag> `,
  permissions: ['mods'],
  aliases: ['banir'],
  category: 'Moderação ⚔️',
  dm: false,
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
              `**Tente usar**\`\`\`${prefix}ban @usuário <motivo>\`\`\``
            )
            .setFooter(
              `${message.author.tag}`,
              `${message.author.displayAvatarURL({ dynamic: true })}`
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }

    const reason = restOfMessage || '<Motivo não especificado>';

    const messageAnt = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor(Colors.red)
        .setThumbnail(Icons.sledgehammer)
        .setAuthor()
        .setTitle(`Você está prestes a Banir os usuários ${users}!`)
        .setDescription(
          `**Pelo Motivo de:**\n\n\`\`\`${reason}\`\`\` \nPara confirmar clique em ✅\n para cancelar clique em ❎`
        )
        /*   .setFooter(`message.author: ${user.id}`) */
        .setTimestamp()
    );

    if (await confirmMessage(message, messageAnt)) {
      await messageAnt.delete();
      if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
        message.channel
          .send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(Icons.erro)
              .setDescription(
                `Ative a permissão de banir para mim, para que você possa usar o comando`
              )
              .setTitle(`Eu não tenho permissão para banir usuários`)
              .setFooter(
                `A permissão pode ser ativada no cargo do bot em configurações`
              )
              .setFooter(
                `${message.author.tag}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
              )
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
      }

      if (!message.member.hasPermission('BAN_MEMBERS')) {
        message.channel
          .send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(Icons.erro)
              .setTitle(`Você não tem permissão para banir os usuários`)
              .setDescription(`Você não pode banir usuários nesse servidor`)
              .setFooter(
                `${message.author.tag}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
              )
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
      }

      /// ///////////////////////////////////////////////////////////////////////

      users.forEach(async (user) => {
        if (user.id === message.guild.me.id) {
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setThumbnail(Icons.erro)
                .setTitle(`Hey, você não pode me banir e isso não é legal :(`)
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }));
          return;
        }

        const memberUser = client.guilds.cache
          .get(message.guild.id)
          .members.cache.get(user.id);
        if (
          memberUser.roles.highest.position >=
          message.guild.me.roles.highest.position
        ) {
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setThumbnail(Icons.erro)
                .setTitle(
                  `Eu não tenho permissão para banir o usuário ${user.tag}`
                )
                .setDescription(
                  `O usuário ${user} tem um cargo acima ou igual a mim, eleve meu cargo acima do dele`
                )
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }));
        } else {
          await message.guild.members
            .ban(user, {
              reason: `Punido por ${message.author.tag} | ${
                message.author.id
              } — Data: ${message.createdAt.toISOString()} — Motivo: ${reason}`,
            })
            .then(() => {
              const guildIdDatabase = new client.Database.table(
                `guild_id_${message.guild.id}`
              );

              function messageForChannelLog() {
                const dateMessage = message.createdAt.toISOString();
                const dataConvert = parseDateForDiscord(dateMessage);

                const dateForMessage = `${dataConvert}`;

                return new Discord.MessageEmbed()
                  .setColor(Colors.pink_red)
                  .setThumbnail(Icons.sucess)
                  .setTitle(`O usuário ${user.tag} foi banido!`)
                  .setDescription(
                    `**Data: ${dateForMessage}**\n**Motivo: **\`\`\`${reason}\`\`\`\n**Author:${message.author}**`
                  )
                  .setFooter(`ID do usuário: ${user.id}`)
                  .setTimestamp();
              }
              const channelLog = client.channels.cache.get(
                guildIdDatabase.get('channel_log')
              );
              if (channelLog) {
                channelLog.send(message.author, messageForChannelLog());
              } else {
                message.channel
                  .send(message.author, messageForChannelLog())
                  .then((msg) => msg.delete({ timeout: 15000 }));
              }

              user
                .send(
                  new Discord.MessageEmbed()
                    .setColor(Colors.pink_red)
                    .setThumbnail(
                      client.user.displayAvatarURL({ dynamic: true })
                    )
                    .setTitle(
                      `Você foi banido do servidor **${message.guild.name}**`
                    )
                    .setDescription(
                      `**Motivo: **\n\`\`\`${reason}\`\`\`\n**Aplicada por: ${message.author}**`
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
                        .setTitle(
                          `Não foi possível avisar na DM do usuário banido!`
                        )
                        .setFooter(`ID do usuário: ${user.id}`)
                        .setTimestamp()
                    )
                    .then((msg) => msg.delete({ timeout: 15000 }))
                );
            });
        }
      });
    } else {
      await messageAnt.delete();
    }
  },
};
