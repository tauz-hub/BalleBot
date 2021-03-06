export const confirmMessage = (message, messageAnt) =>
  new Promise((resolve) => {
    const reactions = ['â', 'â', 'ðµï¸ââï¸'];

    try {
      reactions.forEach((emojiReact) => messageAnt.react(`${emojiReact}`));
    } catch (e) {
      console.log('erro');
    }
    const filter = (reaction) => reactions.includes(reaction.emoji.name);

    const collector = messageAnt.createReactionCollector(filter, {
      time: 15000,
      dispose: true,
    });
    let messageReject = true;
    collector.on('collect', async (emojiAnt, userAnt) => {
      switch (emojiAnt.emoji.name) {
        case 'â':
          if (message.author.id === userAnt.id) {
            messageReject = false;
            resolve(true);
          }
          break;
        case 'â':
          if (message.author.id === userAnt.id) {
            messageReject = false;
            resolve(false);
          }
          break;
        case 'ðµï¸ââï¸':
          if (message.author.id === userAnt.id) {
            messageReject = false;
            resolve('anonimo');
          }
          break;
        default:
          break;
      }
    });

    collector.on('end', async () => {
      if (messageReject) {
        message.channel
          .send(
            `${message.author} vocÃª nÃ£o confirmou e o comando foi cancelado`
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
        resolve(false);
      }
    });
  });
