import GroupRepository from '../../services/database/Models/GroupRepository.js';

export default {
  name: '👍',
  description: 'Validar equipe para o campeonato',
  validChannels: [process.env.BOT_CHAMP_CHANNEL_ID],
  run: async ({ messageReaction }) => {
    const msg = await messageReaction.message.channel.messages.fetch(
      messageReaction.message.id
    );
    const group = JSON.parse(`${msg.content}`.replace(/\n/g, ''));
    group.crew = group.crew.split(',');
    const groupRepository = new GroupRepository();
    await groupRepository.insertOne(group);
  },
};
