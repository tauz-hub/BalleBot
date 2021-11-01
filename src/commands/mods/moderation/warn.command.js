import Discord from 'discord.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from './confirmMessage.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import { uploadImage } from '../../../services/uploadImageImgur/uploadImage.js';

export default {
  name: 'warn',
  description: `<prefix>warn @Usuários/TAGs/Nomes/IDs/Citações <motivo> para alertar e punir usuários`,
  permissions: ['mods'],
  aliases: ['addwarn', 'advertencia', 'avisar'],
  category: 'Moderação ⚔️',
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
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`Não encontrei o usuário!`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}warn @Usuários/TAGs/Nomes/IDs/Citações <motivo>\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }

    let reason = `${restOfMessage}` || '<Motivo não especificado>';
    const anexo = message.attachments.find((anex) => anex.url);

    if (anexo) {
      reason += `\n**Arquivo anexado**: ${anexo.url}`;
    }

    const messageAnt = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setThumbnail(Icons.warn)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTitle(`Você está preste a avisar os Usuários:`)
        .setDescription(
          `**Usuários: ${users.join('|')} \nPelo Motivo de: **${reason}\n
          ✅ Para confirmar
          ❎ Para cancelar
          🕵️‍♀️ Para confirmar e não avisa na DM do usuário`
        )

        .setTimestamp()
    );

    await confirmMessage(message, messageAnt).then(async (res) => {
      await messageAnt.delete();
      if (res) {
        const inviteDm = res !== 'anonimo';
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
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                  )
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
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                  )
                  .setTitle(`Você não tem permissão para avisar o usuário`)
                  .setDescription(
                    `O usuário ${user} está acima ou no mesmo cargo que você, por isso não podes adicionar um aviso a ele`
                  )
                  .setTimestamp()
              )
              .then((msg) => msg.delete({ timeout: 15000 }));
            return;
          }

          function messageSucess() {
            return new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(Icons.sucess)
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`O usuário ${user.tag} foi avisado!`)
              .setDescription(`**Pelo Motivo de: **\n${reason}`)
              .setFooter(`ID do usuário avisado: ${user.id}`)
              .setTimestamp();
          }
          if (channelLog) {
            channelLog.send(message.author, messageSucess());
          } else {
            message.channel
              .send(message.author, messageSucess())
              .then((msg) => msg.delete({ timeout: 15000 }));
          }
          if (inviteDm) {
            user
              .send(
                new Discord.MessageEmbed()
                  .setColor(Colors.pink_red)
                  .setThumbnail(message.guild.iconURL())
                  .setTitle(
                    `Você recebeu um warn do servidor **${message.guild}**`
                  )
                  .setDescription(
                    `**Descrição: **\n\`\`\`${reason}\`\`\`\n**Para rever seu caso fale com: ${message.author}**`
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
          }

          let reasonOfWarn = `${restOfMessage}` || '<Motivo não especificado>';
          if (message.attachments.some((anex) => anex.url)) {
            const urlUpload = await uploadImage(message);
            if (urlUpload) {
              reasonOfWarn += `\n**Arquivo anexado**: ${urlUpload}`;
            }
          }
          if (guildIdDatabase.has(`user_id_${user.id}`)) {
            guildIdDatabase.push(`user_id_${user.id}.autor`, message.author.id);
            guildIdDatabase.push(`user_id_${user.id}.reasons`, reasonOfWarn);
            guildIdDatabase.push(
              `user_id_${user.id}.dataReasonsWarns`,
              new Date()
            );
          } else {
            guildIdDatabase.set(`user_id_${user.id}`, {
              id: user.id,
              reasons: [reasonOfWarn],
              autor: [message.author.id],
              dataReasonsWarns: [new Date()],
            });
          }
        });
      }
    });
  },
};
