import 'dotenv/config';
const { prefix } = process.env;
import Discord from 'discord.js';
import { verifyBannedWords } from './messageVerify/messageVerifyWords.js';
import db from 'quick.db';

export default {
    name: 'message',
    once: false,
    run: (client, message) => {
        if (message.channel.type === 'dm') return

        if (!message.author.bot) {
            if (verifyBannedWords(client, message)) {
                return
            }
        }

        if (!message.author.bot && message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).split(/ +/)
            const commandName = args.shift().toLowerCase();
            const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

            let rolesPermissions = guildIdDatabase.get('admIds')

            if (commandName === 'setadm' && rolesPermissions === null) {
                if (message.guild.ownerID === message.author.id || message.author.id === '760275647016206347') {
                    const commandToBeExecuted = client.Commands.get('setadm')
                    commandToBeExecuted.run({ client, message, args })
                    return;
                }
            }

            if (rolesPermissions === null) {
                message.channel.send(message.author, new Discord.MessageEmbed()
                    .setColor('#ff8997')
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`${message.author.tag} Olá! Fico muito feliz e agredecida por ter me adicionado!!!!`)
                    .setDescription(`Primeiramente, nós do servidor Ballerini ficamos honrado por usar nosso bot. Isso é incrível! 🙀 😻
                    \nPara começar vamos definir os cargos administrativos:
                    \nEu ofereço 4 cargos de hierarquia, Everyone, Padawan, Moderadores e Staff.
                    \nO único que poderá definir os cargos será o dono do servidor!
                    \nEntão mande a seguinte mensagem para definir os cargos repectivamente e saiba sobre os comandos com ${prefix}help!
                    \n#setAdm @cargoPadawan @cargoModeradores @cargoStaff `));
                return;
            }
            try {
                rolesPermissions.owner = message.guild.ownerID;

                const commandToBeExecuted = client.Commands.get(commandName)
                if (commandToBeExecuted) {


                    let rolesUser = [],
                        userHasPermission = false,
                        serverMember = client.guilds.cache.get(message.guild.id),
                        member = serverMember.members.cache.get(message.author.id);

                    member.roles.cache.map(role => rolesUser.push(role.id))

                    commandToBeExecuted.permissions.map(permissionName => {
                        for (let i = 0; i < rolesUser.length; i++) {
                            if (rolesPermissions[permissionName] === rolesUser[i]) {
                                userHasPermission = true;
                            }
                            if (permissionName === 'owner') {
                                if (message.author.id === rolesPermissions.owner) {
                                    userHasPermission = true;
                                }
                            }
                        }
                    });

                    if (userHasPermission || message.author.id === '760275647016206347') {
                        commandToBeExecuted.run({ client, message, args })
                    } else {
                        message.channel.send(message.author, new Discord.MessageEmbed()
                            .setColor('#ff8997')
                            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                            .setTitle(`${message.author.tag} Hey, você não tem permissão :(`)
                            .setDescription(`Apenas ${commandToBeExecuted.permissions.join(" | ")} possuem permissão para usar esse comando`));
                    }
                }
            } catch (e) {
                console.error(e)
            }
        }
    },
};