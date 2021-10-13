import Discord from 'discord.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from './confirmMessage.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';
import Colors from '../../../utils/layoutEmbed/colors.js';

export default {
  name: 'ban',
  description: `<prefix>ban @Usuários/TAGs/Nomes/IDs/Citações <motivo> para banir membros`,
  permissions: ['mods'],
  aliases: ['banir'],
  category: 'Moderação ⚔️',
  dm: false,
  run: async ({ message, client, args, prefix }) => {
    const { users, restOfMessage } = await getUserOfCommand(
      client,
      message,
      prefix
    );
    if (!args[0] && !users) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }

    if (users === undefined) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(Icons.erro)
            .setTitle(`Não encontrei o usuário!`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}ban @Usuários/TAGs/Nomes/IDs/Citações <motivo>\`\`\``
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

    let reason = restOfMessage || '<Motivo não especificado>';
    const anexo = message.attachments.map((anex) => anex.url);

    if (anexo.length > 0) {
      reason += `\n**Arquivo anexado:** ${anexo}`;
    }

    const messageAnt = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor(Colors.red)
        .setThumbnail(Icons.sledgehammer)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`Você está prestes a Banir os usuários:`)
        .setDescription(
          `**Usuários: ${users.join('|')}**\n**Pelo Motivo de: **\n${reason}\n
          ✅ Para confirmar
          ❎ Para cancelar
          🕵️‍♀️ Para confirmar e não avisar que foi você que aplicou`
        )
        .setTimestamp()
    );
    await confirmMessage(message, messageAnt).then(async (res) => {
      await messageAnt.delete();

      if (res) {
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setThumbnail(Icons.erro)
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL({ dynamic: true })
                )
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
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL({ dynamic: true })
                )
                .setTitle(`Você não tem permissão para banir os usuários`)
                .setDescription(`Você não pode banir usuários nesse servidor`)
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }));
        }

        users.forEach(async (user) => {
          if (user.id === message.guild.me.id) {
            message.channel
              .send(
                message.author,
                new Discord.MessageEmbed()
                  .setColor(Colors.pink_red)
                  .setThumbnail(Icons.erro)
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                  )
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
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                  )
                  .setTitle(
                    `Eu não tenho permissão para banir o usuário ${user.tag}`
                  )
                  .setDescription(
                    `O usuário ${user} tem um cargo acima ou igual a mim, eleve meu cargo acima do dele`
                  )
                  .setTimestamp()
              )
              .then((msg) => msg.delete({ timeout: 15000 }));
            return;
          }
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
                    `**Punido por: ${message.author}**\n**Data: ${dateForMessage}**\n**Motivo: **\n${reason}`
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
              const inviteDmAutor =
                res === 'anonimo' ? 'a administração' : message.author;
              user
                .send(
                  new Discord.MessageEmbed()
                    .setColor(Colors.pink_red)
                    .setThumbnail(message.guild.iconURL())
                    .setTitle(
                      `Você foi banido do servidor **${message.guild.name}**`
                    )
                    .setDescription(
                      `**Motivo: **\n${reason}\nCaso ache que o banimento foi injusto, **fale com ${inviteDmAutor}**`
                    )
                    .setFooter(`ID do usuário: ${user.id}`)
                    .setTimestamp()
                )
                .catch(() =>
                  message.channel.send(
                    message.author,
                    new Discord.MessageEmbed()
                      .setAuthor(
                        message.author.tag,
                        message.author.displayAvatarURL({ dynamic: true })
                      )
                      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                      .setColor(Colors.pink_red)
                      .setTitle(
                        `Não foi possível avisar na DM do usuário ${user.tag}!`
                      )
                  )
                );
            });
        });
      }
    });
  },
};
