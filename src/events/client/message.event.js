import 'dotenv/config';
const { prefix } = process.env;
import Discord from 'discord.js'

const rolesPermissions = {
    everyone: '836004917973614662',
    padawans: '658568568565675657',
    mods: '855114433676181535',
    staff: '843651941409488916'
}

export default {
    name: 'message',
    once: false,
    run: (client, message) => {
        if (!message.author.bot && message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).split(/ +/)
            const commandName = args.shift().toLowerCase();

            try {
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
                        }
                    });

                    if (userHasPermission) {
                        commandToBeExecuted.run({ client, message, args })
                    } else {
                        message.channel.send(message.author, new Discord.MessageEmbed()
                            .setColor('#ff8997')
                            .setTitle(`${message.author.tag} Hey, você não tem permissão :(`)
                            .setDescription(`Apenas ${commandToBeExecuted.permissions.join(" | ")} possuem permissão para usar esse comando`)
                        );
                    }
                }
            } catch (e) {
                console.error(e)
            }

        }
    },
};