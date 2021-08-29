import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import db from 'quick.db'

export default {
    name: 'words',
    description: `${prefix}words para ver mensagens proibidas no servidor`,
    permissions: ['mods'],
    aliases: ['viewwords', 'words?'],
    category: '❌ AntiSpam',
    run: ({ message, client, args }) => {
        const guildIdDatabase = new db.table(`guild_id_${message.guild.id}`)

        if (guildIdDatabase.has('wordsBanned')) {
            let listOfWords = guildIdDatabase.get('wordsBanned');

            listOfWords = bouncer(listOfWords)
            listOfWords.sort()

            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setTitle(`${message.author.tag} Aqui está todas as palavras do banco de dados: ☑️`)
                .setDescription('```' + listOfWords.join(' | ') + '```')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true })))
        } else {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setTitle(`${message.author.tag} Seu servidor não foi encontrado: `)
                .setDescription(`Para ativar o sistema de words primeiro adicione palavras com ${prefix}addwords <palavra1> <palavra2> <palavra3> etc...
            \nPara configurar onde os reports irão ser mandados
            \nPara mais detalhes consulte o comando addlog no ${prefix}help addwords`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true })))
        }
    }
};


function bouncer(array) {

    const filterArray = array.filter(function(item) {
        return Boolean(item);
    });

    return filterArray;
}