export async function getUserOfCommand(client, message, prefix) {
  const usersInMessage = [];
  const usersRegexRemoveMessage = [];
  const regexForRemoveMention =
    /(<@!(?=[0-9]{18}))|((?<=[0-9]{18})>)|(<(?=[0-9]{18}))/g;

  const [, ...args] = message.content.split(/ +/);
  const usersBanneds = await message.guild.fetchBans();
  args.forEach(async (text) => {
    const itemArgs = text.replace(regexForRemoveMention, '');

    const messageContent = message.content.replace(regexForRemoveMention, '');

    const pieceOfMessage = messageContent.match(itemArgs);

    const stringSplititemArgs = messageContent.split(pieceOfMessage[0]);

    if (stringSplititemArgs[0].startsWith(prefix)) {
      const index = stringSplititemArgs[0].indexOf(' ');
      stringSplititemArgs[0].slice(0, index + 1);
    }

    stringSplititemArgs[0] += itemArgs;

    const stringSearchUser = stringSplititemArgs[0].split(' ').reverse();
    for (let i = 0; i < stringSearchUser.length; i++) {
      let userPush;
      try {
        userPush =
          client.users.cache.find(
            (u) =>
              u.tag === stringSearchUser[0] ||
              u.id === stringSearchUser[0] ||
              u.username === stringSearchUser[0]
          ) ||
          usersBanneds.find(
            (userbanned) =>
              userbanned.user.tag === stringSearchUser[0] ||
              userbanned.user.id === stringSearchUser[0] ||
              userbanned.user.username === stringSearchUser[0]
          ).user;
        // eslint-disable-next-line no-empty
      } catch (e) {}

      if (userPush) {
        if (usersInMessage.indexOf(userPush) === -1) {
          usersInMessage.push(userPush);
          usersRegexRemoveMessage.push(stringSearchUser[0]);
        }
        stringSearchUser.length = 0;
      }
      stringSearchUser[0] = `${stringSearchUser[i + 1]} ${stringSearchUser[0]}`;
    }
  });

  if (
    message.mentions.users.first() &&
    usersInMessage.indexOf(message.mentions.users.first()) === -1
  ) {
    usersInMessage.push(message.mentions.users.first());
  }

  const regexUsers = new RegExp(
    usersRegexRemoveMessage.filter((text) => text).join('|'),
    'g'
  );
  const indexRemoveShiftCommand = message.content.indexOf(' ');

  const text =
    indexRemoveShiftCommand === -1
      ? ''
      : message.content.slice(
          indexRemoveShiftCommand + 1,
          message.content.length
        );
  const removeUsersOfMessageRegex = /(<@![0-9]{18}>)|(<[0-9]{18}>)/g;
  const messageInvite = text
    .replace(removeUsersOfMessageRegex, '')
    .replace(regexUsers, '')
    .trim();

  if (usersInMessage.length > 0) {
    return { users: usersInMessage, restOfMessage: messageInvite };
  }
  return { users: undefined, restOfMessage: messageInvite };
}
