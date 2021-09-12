export default {
  name: 'messageReactionAdd',
  run: (client, messageReaction, user) => {
    const reaction = client.Reactions.get(messageReaction.emoji.name);
    if (
      reaction &&
      reaction?.validChannels.includes(messageReaction.message.channel.id)
    ) {
      reaction.run({ client, user, messageReaction });
    }
  },
};
