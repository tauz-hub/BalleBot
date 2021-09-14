export function statusActivity(client) {
  const status = [
    `❤️Rafaella Ballerini on Youtube!❤️`,
    `💜Rafaella Ballerini on Twitch!💜`,
    `🧡Rafaella Ballerini on Instagram!🧡`,
    `🎧Coding with Lo-fi!🎧`,
    `⭐Stream Lo-fi!⭐`,
    `👨‍💻Contact TAUZ#0001 for questions about me😺`,
  ];
  let i = 0;

  setInterval(
    () =>
      client.user.setActivity(`${status[i++ % status.length]}`, {
        type: 'WATCHING',
      }),
    5000
  );
}
