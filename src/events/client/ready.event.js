import { statusActivity } from '../../assets/statusActivity.js'
import db from 'quick.db'

export default {
    name: 'ready',
    once: true,
    run: (client) => {
        statusActivity(client);
        console.log(`Logged as ${client.user.tag}`);
    },
};