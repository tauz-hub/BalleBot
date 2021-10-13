import Discord from 'discord.js';
import imgur from 'imgur';
import { verifyBannedWords } from './messageVerify/messageVerifyWords.js';
import Colors from '../../utils/layoutEmbed/colors.js';

export default {
  name: 'message',
  once: false,
  run: (client, message) => {
    if (message.author.bot) return;

    if (verifyBannedWords(client, message)) return;
    const anexo = message.attachments.map((anex) => anex.url);
    console.log(anexo[0]);

    imgur.setClientId('548e6d2d5249c7f');
    imgur.getClientId();
    imgur
      .uploadUrl(anexo[0])
      .then((json) => {
        message.channel.send(`\`${json.link}\``);
      })
      .catch((err) => {
        console.error(err.message);
      });

    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    let { prefix } = process.env;
    if (guildIdDatabase.has(`prefix`)) {
      prefix = guildIdDatabase.get(`prefix`);
    }

    if (
      message.mentions.users.first() &&
      message.mentions.users.first().id === message.guild.me.id &&
      message.content === `<@!${message.guild.me.id}>`
    ) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setTitle(`Meu prefixo no servidor é **\`${prefix}\`**`)
          .setFooter(
            `${message.author.tag}`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          )
          .setTimestamp()
      );
      return;
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    try {
      const commandToBeExecuted = client.Commands.get(commandName);
      if (commandToBeExecuted) {
        const dmTrueOrFalse = commandToBeExecuted.dm;
        if (message.channel.type === 'dm') {
          if (dmTrueOrFalse) {
            return commandToBeExecuted.run({ client, message, args, prefix });
          }
          return;
        }

        const rolesPermissions = guildIdDatabase.get('admIds') || {};
        rolesPermissions.owner = message.guild.ownerID;

        const rolesUser = client.guilds.cache
          .get(message.guild.id)
          .members.cache.get(message.author.id)
          .roles.cache.map((role) => role.id);

        const namesOfRoles = Object.keys(rolesPermissions).reverse();

        const userHasPermissionOf = namesOfRoles.find((nameRole) => {
          if (rolesPermissions[nameRole]) {
            if (
              rolesUser.indexOf(rolesPermissions[nameRole]) > -1 ||
              message.author.id === rolesPermissions.owner
            ) {
              return nameRole;
            }
          }
          return false;
        });

        const userHasPermissionToExecuteCommand =
          commandToBeExecuted.permissions.some((permissionName) => {
            const dic = {
              owner: 4,
              staff: 3,
              mods: 2,
              padawans: 1,
              everyone: 0,
            };
            const positionUser = dic[userHasPermissionOf];
            const positionPermissionCommand = dic[permissionName];

            if (positionUser >= positionPermissionCommand) return true;
            return false;
          });

        if (
          (!userHasPermissionToExecuteCommand ||
            commandToBeExecuted.name.toLowerCase() !== 'setadm') &&
          !rolesPermissions.staff
        ) {
          message.channel.send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setTitle(
                `${message.author.tag} Olá! Fico muito feliz e agredecida por ter me adicionado!!!!`
              )
              .setDescription(`Primeiramente, nós do servidor Ballerini ficamos honrado por usar nosso bot. Isso é incrível! 🙀 😻
                        \nPara começar vamos definir os cargos administrativos:
                        \nEu ofereço 4 cargos de hierarquia, Everyone, Padawan, Moderadores e Staff.
                        \nO único que poderá definir os cargos será o dono do servidor!
                        \nEntão mande a seguinte mensagem para definir os cargos repectivamente e saiba sobre os comandos com ${prefix}help!
                        \n${prefix}setAdm @cargoPadawan @cargoModeradores @cargoStaff `)
          );
          return;
        }
        if (userHasPermissionToExecuteCommand) {
          commandToBeExecuted.run({ client, message, args, prefix });
        } else {
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setTitle(`Hey, você não tem permissão :(`)
                .setDescription(
                  `**Apenas ${commandToBeExecuted.permissions.join(
                    ' **|** '
                  )} possuem permissão para usar esse comando**`
                )
            )
            .then((msg) => {
              msg.delete({ timeout: 10000 });
            });
        }
        message.delete();
      }
    } catch (e) {
      console.error(e);
    }
  },
};
