import { messageWarnAndMute } from './messageWarnAndMute.js';

export function verifyBannedWords(client, message) {
  if (message.channel.type === 'dm') return;

  const guildIdDatabase = new client.Database.table(
    `guild_id_${message.guild.id}`
  );

  const rolesUser = [];

  const server = client.guilds.cache.get(message.guild.id);
  const member = server.members.cache.get(message.author.id);

  member.roles.cache.map((role) => rolesUser.push(role.id));

  if (guildIdDatabase.has('admIds')) {
    const rolesPermissions = guildIdDatabase.get('admIds');

    const userHasPermission =
      rolesUser.includes(rolesPermissions.mods) ||
      rolesUser.includes(rolesPermissions.staff) ||
      rolesUser.includes(rolesPermissions.padawan) ||
      message.guild.ownerID === message.author.id;

    if (!userHasPermission && guildIdDatabase.has('listOfWordsBanned')) {
      const listOfWordsBannedGuild = guildIdDatabase.get('listOfWordsBanned');

      const messageLowerCase = message.content.toLowerCase();

      if (listOfWordsBannedGuild.length !== 0) {
        const wordsRegex = new RegExp(
          listOfWordsBannedGuild.filter((word) => word).join('|'),
          'g'
        );

        if (wordsRegex.test(messageLowerCase)) {
          const messageMarked = messageLowerCase.replace(wordsRegex, '**$&**');
          messageWarnAndMute(message, client, messageMarked);
          return true;
        }
      }
    }
  }
  return false;
}
