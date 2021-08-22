import Discord from 'discord.js'
import { prefix } from '../../assets/prefix.js'
import db from 'quick.db'

const permissionsDatabase = new db.table('permissionsDatabase')

export default {
    name: 'setAdm',
    description: `Para adionar os cargos de administração use ${prefix}addRolesAdm <idPadawan> <idModeradores> <idStaff>`,
    permissions: ['owner'],
    aliases: ['addAdm', 'addRolesAdm'],
    run: ({ message, client, args }) => {

        function messageErro() {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail('https://i.imgur.com/3Xto09h.png')
                .setTitle(`Os Cargos Administrativos não foram encontrados!:`)
                .setDescription(`**Desculpa, mas não encontrei os cargos marcados.**
                \n**•** Mande no seguinte esquema (o nome do cargo pode ser qualquer um):
                \n` + '`' + `${prefix}` + 'setAdm @cargoPadawan @cargoMods @cargoStaff' + '`'))
        }
        if (!args[2]) {
            messageErro();
            return;
        }

        const loadsToBeConsidered = [args[0], args[1], args[2]];

        let positionMap = 0;
        loadsToBeConsidered.map(idrole => {

            if (idrole.indexOf('@') !== -1) {
                loadsToBeConsidered[positionMap] = idrole.replace('<@&', '')
                loadsToBeConsidered[positionMap] = loadsToBeConsidered[positionMap].replace('>', '')
                positionMap++;
            }
        })

        for (let i = 0; i < loadsToBeConsidered.length; i++) {
            const cargo = client.guilds.cache.get(message.guild.id).roles.cache.get(loadsToBeConsidered[i]);
            if (!cargo) {
                messageErro()
            }
        }
        const permissionIDs = {
            everyone: message.guild.id,
            padawan: loadsToBeConsidered[0],
            mods: loadsToBeConsidered[1],
            staff: loadsToBeConsidered[2]
        }
        permissionsDatabase.set(`${message.guild.id}`, permissionIDs)

        message.channel.send(message.author, new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail('https://i.imgur.com/oKLZb0T.png')
            .setTitle(`Os Cargos Administrativos foram setados!:`)
            .setDescription(
                '**• Esses são os cargos que foram setados:**' +
                '\n*Padawan:* ' + '<@&' + loadsToBeConsidered[0] + '>' +
                '\n*Mods:* ' + '<@&' + loadsToBeConsidered[1] + '>' +
                '\n*Staff:* ' + '<@&' + loadsToBeConsidered[2] + '>' +
                `\n**• Todos os membros que possuem esses cargos vão ter acesso ao comandos respectivos que podem ser vistos em ${prefix}help ** `))
    }
};