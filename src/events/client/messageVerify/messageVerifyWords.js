import db from 'quick.db'
import { messageWarnAndMute } from './messageWarnAndMute.js'

export function verifyBannedWords(client, message) {
    if (message.channel.type === 'dm') return
    const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

    let rolesUser = [],
        userHasPermission = false,
        serverMember = client.guilds.cache.get(message.guild.id),
        member = serverMember.members.cache.get(message.author.id);

    member.roles.cache.map(role => rolesUser.push(role.id))

    if (guildIdDatabase.has('permissionAdmIds')) {
        let rolesPermissions = guildIdDatabase.get('permissionAdmIds')

        for (let i = 0; i < rolesUser.length; i++) {
            if (rolesPermissions.mods === rolesUser[i] || rolesPermissions.staff === rolesUser[i] || message.guild.ownerID === rolesUser[i]) {
                userHasPermission = true;
            }
        }

        if (!userHasPermission) {
            const userMessage = message.content.toLowerCase()
            if (guildIdDatabase.has('wordsBanned')) {
                let wordsBannedGuild = guildIdDatabase.get('wordsBanned')
                    //  if (!wordsBannedGuild) return false;
                let listRegex = [],
                    messageMarked = message.content,
                    wordsInMessage = [];

                if (wordsBannedGuild.length !== 0) {
                    wordsBannedGuild.map(myWord => {
                        if (myWord !== null) {
                            listRegex.push(new RegExp(myWord));
                        }
                    })
                    let warnAlert = false;

                    listRegex.some(rx => {
                        rx.test(userMessage)
                        if (rx.test(userMessage)) {
                            warnAlert = true;
                            console.log(rx)
                            wordsInMessage.push(rx)
                            const rxString = rx.toString().replace(/\//g, '')
                            messageMarked = messageMarked.replace(rx, `**${rxString}**`)
                        }
                    })

                    if (warnAlert) {
                        messageWarnAndMute(message, client, messageMarked)
                        return true;
                    } else {
                        return false;
                    }
                }
            } else { return false }
        } else { return false }
    }
}