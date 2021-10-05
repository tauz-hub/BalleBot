export function getUserOfCommand(client, message, prefix) {
  const usersInMessage = [];
  const usersRegexRemoveMessage = [];
  const regexForRemoveMention = /(<)|(@!)|(>)/g;

  const [, ...args] = message.content.split(/ +/);

  args.forEach((text) => {
    const itemArgs = text.replace(regexForRemoveMention, '');
    const regexId = /(.*#\d{4})|([0-9]{18})/g;

    if (regexId.test(itemArgs)) {
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
        if (
          client.users.cache.some(
            (u) => u.tag === stringSearchUser[0] || u.id === stringSearchUser[0]
          )
        ) {
          const userPush = client.users.cache.find(
            (u) => u.tag === stringSearchUser[0] || u.id === stringSearchUser[0]
          );

          if (usersInMessage.indexOf(userPush) === -1) {
            usersInMessage.push(userPush);
            usersRegexRemoveMessage.push(stringSearchUser[0]);
          }
          stringSearchUser.length = 0;
        }

        stringSearchUser[0] = `${stringSearchUser[i + 1]} ${
          stringSearchUser[0]
        }`;
      }
    }
  });

  const regexUsers = new RegExp(
    usersRegexRemoveMessage.filter((text) => text).join('|'),
    'g'
  );
  let messageInvite = message.content
    .replace(regexUsers, '')
    .replace(regexForRemoveMention, '');

  if (regexUsers.test(message.content)) {
    const index = messageInvite.indexOf(' ');
    messageInvite = messageInvite.slice(index + 1, messageInvite.length).trim();
  }
  if (usersInMessage) {
    return { users: usersInMessage, restOfMessage: messageInvite };
  }
  return undefined;
}
