import 'dotenv/config';

import { Client } from 'discord.js';
import db from 'quick.db';
import eventHandler from './events/Events.handler.js';
import commandHandler from './commands/Command.handler.js';

const { TOKEN } = process.env;

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USERS', 'GUILD_MEMBER'],
});

client.Events = eventHandler(client);
client.Commands = commandHandler();
client.Database = db;

client.login(TOKEN);
