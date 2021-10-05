import Discord from 'discord.js';
import Colors from '../../utils/layoutEmbed/colors.js';

export function setIntervalRemoveMute(client) {
  const tableTemporarilyMutated = new client.Database.table(
    `tableTemporarilyMutated`
  );
  const myList = tableTemporarilyMutated.all();

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
            new Discord.MessageEmbed()
              .setTitle(`Usuário foi desmutado após o tempo limite!`)
              .setAuthor(
                `${user.tag}`,
                user.displayAvatarURL({ dynamic: true })
              )
              .setDescription(`**Descrição:**\`\`\`${userMuted.reason}\`\`\``)
              .setThumbnail(user.displayAvatarURL({ dynamic: true }))
              .setColor(Colors.pink_red)
              .setFooter(`ID do usuário : ${user.id}`)
              .setTimestamp()
          );
        }
        tableTemporarilyMutated.delete(
          `guild_id_${userMuted.guildId}_user_id_${userMuted.id}`
        );
      }
    }
  });
}
