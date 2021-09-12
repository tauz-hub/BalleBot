export function getUserOfCommand(client, message) {
  const [command, ...rest] = message.content.split(' ');
  let [userTag, ...msg] = rest;
  msg = msg.join(' ');
  if (userTag) userTag.replace(/(<)(>)/g, '');

  if (isNaN(userTag)) {
    const index = message.content.indexOf('#');

    if (index >= 0) {
      userTag = message.content.slice(command.length + 1, index + 5);

      msg = message.content.slice(index + 5, message.content.length);
    }
  }

  let user;

  user = client.users.cache.find((u) => u.tag === userTag || u.id === userTag);

  if (message.mentions.users.size > 0 && !user) {
    user = message.mentions.users.first();
  }
  if (user) {
    return { user, index: message.content.indexOf(msg) };
  }
  return { undefined, index: undefined };
}
