export default {
  name: 'ready',
  once: true,
  run: (client) => {
    console.log(`Logged as ${client.user.tag}`);
  },
};
