import Discord from 'discord.js';
import Colors from '../../utils/layoutEmbed/colors.js';

export function setIntervalRemoveMute(client) {
  const tableMuted = new client.Database.table(`tableMuted`);
  const myList = tableMuted.all();

  myList.forEach((element) => {
    const userMuted = JSON.parse(element.data);

    let dataUserMuted = userMuted.dateMuted;

    if (dataUserMuted) {
      dataUserMuted = new Date(dataUserMuted);
      if (dataUserMuted < new Date()) {
        const userMember = client.guilds.cache
          .get(userMuted.guildId)
          .members.cache.get(userMuted.id);
        userMember.roles.remove(userMuted.roleId);

        const user = client.users.cache.get(userMuted.id);
        const guildIdDatabase = new client.Database.table(
          `guild_id_${userMuted.guildId}`
        );

        const channelLog = client.channels.cache.get(
          guildIdDatabase.get('channel_log')
        );

        if (channelLog) {
          channelLog.send(
            userMember.user,
            new Discord.MessageEmbed()
              .setTitle(
                `Usuário foi desmutado após o tempo limite : ${user.tag}`
              )
              .setAuthor(
                `${user.tag}`,
                user.displayAvatarURL({ dynamic: true })
              )
              .setDescription(`**Descrição:**\`\`\`${userMuted.reason}\`\`\``)
              .setThumbnail('https://i.imgur.com/Jut1wGO.png')
              .setColor(Colors.pink_red)
              .setFooter(`ID do usuário : ${user.id}`)
          );
        }
        tableMuted.delete(
          `guild_id_${userMuted.guildId}_user_id_${userMuted.id}`
        );
      }
    }
  });
}
