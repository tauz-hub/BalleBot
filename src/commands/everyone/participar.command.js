import UserRepository from '../../services/database/Models/UserRepository.js';

export default {
  name: 'Participar',
  description: '',
  permissions: [],
  run: async ({ message, args }) => {
    const messageId = message.id;
    const username = `${message.author.username}#${message.author.discriminator}`;
    const userId = message.author.id;
    const argIndex = args.findIndex((arg) => !isNaN(Number(arg)));
    let level = Number(args.splice(argIndex, 1));
    if (level > 5) {
      level = 5;
    }
    if (level < 1) {
      level = 1;
    }
    const name = String().concat(args).replace(/,/g, ' ');
    const user = { username, userId, messageId, level, name };
    try {
      const userRepository = new UserRepository();
      await userRepository.insertOne(user);
      await message.react('🤞');
    } catch (error) {
      console.error(error);
    }
  },
};
