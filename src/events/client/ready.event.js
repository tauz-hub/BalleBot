import { statusActivity } from '../../assets/statusActivity.js';
import { setIntervalRemoveMute } from '../../services/setTimeoutMute/setTimeOutMute.js';

export default {
  name: 'ready',
  once: true,
  run: (client) => {
    setInterval(async () => {
      setIntervalRemoveMute(client);
    }, 1000);

    statusActivity(client);
    console.log(`Logged as ${client.user.tag}`);
  },
};
