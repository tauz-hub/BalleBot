import Discord from 'discord.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from './confirmMessage.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';
import Colors from '../../../utils/layoutEmbed/colors.js';

export default {
  name: 'mute',
  description: `<prefix>mute @usuário/TAG/ID <motivo> <tempo/2d 5h 30m 12s> para mutar usuários`,
  permissions: ['mods'],
  aliases: ['mutar', 'silenciar'],
  category: 'Moderação ⚔️',
  dm: false,
  run: async ({ message, client, args, prefix }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(client.Commands.get(command), message);
      return;
    }

    if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
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
              `Ative a permissão de manusear cargos para mim, para que você possa usar o comando mute`
            )
            .setTitle(`Eu não tenho permissão para mutar usuários`)
            .setFooter(
              `A permissão pode ser ativada no cargo do bot em configurações`
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }

    if (
      !client.guilds.cache
        .get(message.guild.id)
        .members.cache.get(message.author.id)
        .hasPermission('MANAGE_ROLES')
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
            .setDescription(
              `Peça a um administrador ver o seu caso, você precisa de permissão para manusear cargos`
            )
            .setTitle(`Você não tem permissão para mutar usuários`)
            .setFooter(
              `A permissão pode ser ativada no seu cargo em configurações`
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }

    const { users, restOfMessage } = getUserOfCommand(client, message, prefix);

    if (!users) {
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
            .setTitle(`Não encontrei o usuário!`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}mute @usuário/TAG/ID <motivo> <tempo/2d 5h 30m 12s>\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }

    const textMessage = restOfMessage || '<Motivo não especificado>';
    const timeValidation = /(\d+d)|(\d+h)|(\d+m)|(\d+s)/gi;
    const reasonMuted =
      `${textMessage.replace(timeValidation, '').trim()}` || '<invalido>';

    const messageAnt = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor(Colors.red)
        .setThumbnail(Icons.mute)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`Você está prestes a Mutar os usuários:`)
        .setDescription(
          `**Usuários: ${users.join(
            '|'
          )}**\n**Pelo Motivo de : **\n\n\`\`\`${reasonMuted}\`\`\` \nPara confirmar clique em ✅\n para cancelar clique em ❎`
        )
        .setTimestamp()
    );
    if (await confirmMessage(message, messageAnt)) {
      await messageAnt.delete();

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
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL({ dynamic: true })
                )
                .setTitle(`Hey, você não pode me mutar e isso não é legal :(`)
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }));
          return;
        }
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
                  `Eu não tenho permissão para mutar o usuário ${user.tag}`
                )
                .setDescription(
                  `O usuário ${user} tem um cargo acima ou igual a mim, eleve meu cargo acima do dele`
                )
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }));
          return;
        }
        if (memberUser.hasPermission('ADMINISTRATOR')) {
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
                .setTitle(`O usuário ${user.tag} é administrador`)
                .setDescription(
                  `O usuário ${user} tem um cargo de administrador, o comando mute não funcionará com ele`
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
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL({ dynamic: true })
                )
                .setTitle(`Você não tem permissão para mutar o usuário`)
                .setDescription(
                  `O usuário ${user} está acima ou no mesmo cargo que você, peça a um administrador elevar seu cargo`
                )
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }));
        } else {
          const guildIdDatabase = new client.Database.table(
            `guild_id_${message.guild.id}`
          );

          const timeArray = textMessage.match(timeValidation);

          let timeInMiliSeconds = 0;

          let dateForDatabase = 'indefinido';
          if (timeArray) {
            const stringOfTime = {
              d: 1000 * 60 * 60 * 24,
              h: 1000 * 60 * 60,
              m: 1000 * 60,
              s: 1000,
            };

            timeArray.forEach((element) => {
              timeInMiliSeconds +=
                stringOfTime[element.slice(-1)] * element.slice(0, -1);
            });

            dateForDatabase = new Date().setMilliseconds(
              new Date().getMilliseconds() + timeInMiliSeconds
            );
          }

          let muterole = message.guild.roles.cache.find(
            (muteroleObj) => muteroleObj.name === 'muted'
          );
          if (!muterole) {
            muterole = await message.guild.roles.create({
              data: {
                name: 'muted',
                color: 'ligth_brown',
                permissions: [],
              },
            });

            message.guild.channels.cache.forEach(async (channel) => {
              await channel.overwritePermissions([
                {
                  id: muterole.id,
                  deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
                },
              ]);
            });
          }
          guildIdDatabase.set('roleMutedId', muterole.id);

          const tableTemporarilyMutated = new client.Database.table(
            `tableTemporarilyMutated`
          );
          const userReasonFullMuted = {
            id: user.id,
            dateMuted: new Date(dateForDatabase),
            guildId: message.guild.id,
            roleId: muterole.id,
            reason: `Punido por ${message.author.tag} | ${message.author.id} — Motivo: ${reasonMuted}`,
          };
          const guildUndefinedMutated = new client.Database.table(
            `guild_users_mutated_${message.guild.id}`
          );
          if (guildUndefinedMutated.has(`user_id_${user.id}`)) {
            guildUndefinedMutated.delete(`user_id_${user.id}`);
          } else if (
            tableTemporarilyMutated.has(
              `guild_id_${message.guild.id}_user_id_${user.id}`
            )
          ) {
            tableTemporarilyMutated.delete(
              `guild_id_${message.guild.id}_user_id_${user.id}`
            );
          }

          if (dateForDatabase === 'indefinido') {
            guildUndefinedMutated.set(
              `user_id_${user.id}`,
              userReasonFullMuted
            );
          } else {
            tableTemporarilyMutated.set(
              `guild_id_${message.guild.id}_user_id_${user.id}`,
              userReasonFullMuted
            );
          }

          const userMember = client.guilds.cache
            .get(message.guild.id)
            .members.cache.get(user.id);

          await userMember.roles.add(muterole.id);
          const inviteMessageDate =
            dateForDatabase !== 'indefinido'
              ? parseDateForDiscord(dateForDatabase)
              : '`indefinido`';

          message.channel.send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(user.displayAvatarURL({ dynamic: true }))
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`Usuário mutado com sucesso: ${user.tag}`)
              .setDescription(
                `**Data final do Mute:** ${inviteMessageDate}\n**Descrição:**\`\`\`${userReasonFullMuted.reason}\`\`\``
              )
              .setFooter(`ID do usuário: ${userReasonFullMuted.id}`)
              .setTimestamp()
          );
        }
      });
    } else {
      await messageAnt.delete();
    }
  },
};
