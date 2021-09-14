import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from './confirmMessage.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';
import Colors from '../../../utils/layoutEmbed/colors.js';

export default {
  name: 'mute',
  description: `${prefix}mute <userId> <tempo> ou ${prefix}mute @usuário <tempo> ou ${prefix}mute <userTag> <tempo>`,
  permissions: ['mods'],
  aliases: ['mutar', 'silenciar'],
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
              `**Tente usar**\`\`\`${prefix}mute @usuário <motivo> <tempo>\`\`\``
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
            .setThumbnail(Icons.erro)
            .setColor(Colors.pink_red)
            .setTitle(`Hey, você não pode me mutar e isso não é legal :(`)
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }

    const textMessage =
      args[0] && index !== 0
        ? message.content.slice(index, message.content.length)
        : '<Motivo não especificado>';
    const timeValidation = /(\d+d)|(\d+h)|(\d+m)|(\d+s)/gi;
    const reasonMuted =
      textMessage.replace(timeValidation, '').trim() || '<invalido>';

    const messageAnt = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor(Colors.red)
        .setThumbnail(Icons.mute)
        .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Você está prestes a Mutar um usuário!`)
        .setDescription(
          `**Pelo Motivo de : **\n\n\`\`\`${reasonMuted}\`\`\` \nPara confirmar clique em ✅\n para cancelar clique em ❎`
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
              .setTitle(`Eu não tenho permissão para mutar o usuário`)
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
              .setTitle(`O usuário é administrador`)
              .setDescription(
                `O usuário ${user} tem um cargo de administrador, o comando mute não funcionará com ele`
              )
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
        return;
      }
      if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
        message.channel
          .send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(Icons.erro)
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
        memberUser.roles.highest.position >=
        message.member.roles.highest.position
      ) {
        message.channel
          .send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(Icons.erro)
              .setTitle(`Você não tem permissão para mutar o usuário`)
              .setDescription(
                `O usuário ${user} está acima ou no mesmo cargo que você, peça a um administrador elevar seu cargo`
              )
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
      } else {
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
              color: '#FF0000',
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

        const tableMuted = new client.Database.table(`tableMuted`);

        tableMuted.set(`guild_id_${message.guild.id}_user_id_${user.id}`, {
          id: user.id,
          dateMuted: new Date(dateForDatabase),
          guildId: message.guild.id,
          roleId: muterole.id,
          reason: reasonMuted,
        });

        const userMember = client.guilds.cache
          .get(message.guild.id)
          .members.cache.get(user.id);

        await userMember.roles.add(muterole.id);
        const dataForMessage = `<t:${parseInt(
          dateForDatabase / (1000).toFixed(0),
          10
        )}:F>`;
        message.channel.send(`data para desmutar: ${dataForMessage}`);
      }
    } else {
      await messageAnt.delete();
    }
  },
};
