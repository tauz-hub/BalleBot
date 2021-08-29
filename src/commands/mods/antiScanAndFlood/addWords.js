import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'
import Discord from 'discord.js'


export default {
    name: 'addwords',
    description: `${prefix}words para ver mensagens proibidas no servidor`,
    permissions: ['mods'],
    aliases: ['setwords'],
    category: '❌ AntiSpam',
    run: ({ message, client, args }) => {


        const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

        let setRegexList = [],
            position = 0;

        for (let i = 0; i < args.length; i++) {
            setRegexList.push(args[i].toLowerCase())
        }
        if (!guildIdDatabase.has('channel_log')) {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`${message.author.tag}O seu servidor não possui um chat log para usar esse recurso!`)
                .setDescription(`**use ${prefix}addlog <#chat> para setar o canal de configurações**`))
            return
        }


        function messageSucess() {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`${message.author.tag} As Palavras ou Links foram adicionados ao banco com sucesso!`)
                .setDescription('**Essas foram as palavras ou links adicionados:** \n' + '```' + args.join(' | ') + '```'))
        }

        if (guildIdDatabase.has('wordsBanned')) {

            let listRegexInDatabase = guildIdDatabase.get('wordsBanned');


            for (let i = 0; i < setRegexList.length; i++) {
                for (let j = 0; j < listRegexInDatabase.length; j++) {
                    if (setRegexList[i] === listRegexInDatabase[j]) {
                        setRegexList.splice(i, 1)
                    }
                }
            }

            for (let j = 0; j < listRegexInDatabase.length; j++) {
                if (listRegexInDatabase[j] === null) {
                    try {
                        guildIdDatabase.set(`wordsBanned.${j}`, setRegexList[position])
                        position++;
                    } catch (e) {}
                }
            }

            for (let i = position; i < setRegexList.length - position; i++) {
                guildIdDatabase.push('wordsBanned', setRegexList[i])
            }
            messageSucess();

        } else {
            guildIdDatabase.set('wordsBanned', setRegexList)
            messageSucess();
        }
    }
}