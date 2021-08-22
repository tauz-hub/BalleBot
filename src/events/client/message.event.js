import 'dotenv/config';
const { prefix } = process.env;
import Discord from 'discord.js'

import db from 'quick.db'
const permissionsDatabase = new db.table('permissionsDatabase')

export default {
    name: 'message',
    once: false,
    run: (client, message) => {

        if (!message.author.bot && message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).split(/ +/)
            const commandName = args.shift().toLowerCase();

            let rolesPermissions = permissionsDatabase.get(`${message.guild.id}`)

            if (commandName === 'setadm' && rolesPermissions === null) {
                if (message.guild.ownerID === message.author.id) {
                    const commandToBeExecuted = client.Commands.get('setadm')
                    commandToBeExecuted.run({ client, message, args })
                    return;
                }
            }

            if (rolesPermissions === null) {
                message.channel.send(message.author, new Discord.MessageEmbed()
                    .setColor('#ff8997')
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
                console.log(rolesPermissions)

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

                    if (userHasPermission) {
                        commandToBeExecuted.run({ client, message, args })
                    } else {
                        message.channel.send(message.author, new Discord.MessageEmbed()
                            .setColor('#ff8997')
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