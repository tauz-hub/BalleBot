import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from './confirmMessage.js';
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

    const { user, index } = getUserOfCommand(client, message);

    if (!user) {
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

    const reason =
      args[0] && index !== 0
        ? message.content.slice(index, message.content.length).trim()
        : '<Motivo não especificado>';

    const messageAnt = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor(Colors.red)
        .setThumbnail(Icons.sledgehammer)
        .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Você está prestes a Banir um usuário!`)
        .setDescription(
          `**Pelo Motivo de:**\n\n\`\`\`${reason}\`\`\` \nPara confirmar clique em ✅\n para cancelar clique em ❎`
        )
        .setFooter(`ID do usuário: ${user.id}`)
        .setTimestamp()
    );

    if (await confirmMessage(message, messageAnt)) {
      await messageAnt.delete();
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
              .setTitle(`Eu não tenho permissão para banir o usuário`)
              .setDescription(
                `O usuário ${user} tem um cargo acima ou igual a mim, eleve meu cargo acima do dele`
              )
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
      } else if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
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
      } else if (
        memberUser.roles.highest.position >=
          message.member.roles.highest.position ||
        !message.member.hasPermission('BAN_MEMBERS')
      ) {
        message.channel
          .send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(Icons.erro)
              .setTitle(`Você não tem permissão para banir o usuário`)
              .setDescription(
                `O usuário ${user} está acima ou no mesmo cargo que você, por isso você não pode banir do servidor`
              )
              .setFooter(
                `${message.author.tag}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
              )
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
      } else {
        await message.guild.members
          .ban(user, {
            reason: `Punido por ${
              message.author.tag
            } — Data: ${message.createdAt.toISOString()} — Motivo: ${reason}`,
          })
          .then(() => {
            const guildIdDatabase = new client.Database.table(
              `guild_id_${message.guild.id}`
            );

            function messageForChannelLog() {
              const dateMessage = message.createdAt.toISOString();
              const dataConvert = parseInt(
                (new Date(dateMessage).getTime() / 1000).toFixed(0),
                10
              );
              const dateForMessage = `<t:${dataConvert}:F>`;

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
                  .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
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
    } else {
      await messageAnt.delete();
    }
  },
};
