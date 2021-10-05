import Discord from 'discord.js';
import { verifyBannedWords } from './messageVerify/messageVerifyWords.js';
import Colors from '../../utils/layoutEmbed/colors.js';
import Icons from '../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'message',
  once: false,
  run: (client, message) => {
    if (message.author.bot) return;

    if (verifyBannedWords(client, message)) return;

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

        const rolesPermissions = guildIdDatabase.get('admIds') || {
          owner: message.guild.ownerID,
        };

        const rolesUser = client.guilds.cache
          .get(message.guild.id)
          .members.cache.get(message.author.id)
          .roles.cache.map((role) => role.id);

        const userHasPermission = commandToBeExecuted.permissions.find(
          (permissionName) =>
            rolesUser.includes(rolesPermissions[permissionName]) ||
            message.guild.ownerID === message.author.id ||
            message.author.id === '760275647016206347'
        );

        if (
          (!userHasPermission ||
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
        if (userHasPermission) {
          commandToBeExecuted.run({ client, message, args, prefix });
        } else {
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setThumbnail(Icons.erro)
                .setTitle(
                  `${message.author.tag} Hey, você não tem permissão :(`
                )
                .setDescription(
                  `Apenas ${commandToBeExecuted.permissions.join(
                    ' **|** '
                  )} possuem permissão para usar esse comando`
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
