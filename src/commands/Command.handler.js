import path from 'path';
import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import db from 'quick.db';
import { setCommandsInDatabase } from '../services/database/setCommandsInDatabase.js';

const commandFolders = [
  'everyone',
  'padawan',
  'mods',
  'staff',
  'owner',
  'seasons',
];

function genCommand(folder, returnCollection) {
  const folderPath = path.resolve(path.dirname(''), 'src', 'commands', folder);

  const commandFiles = readdirSync(folderPath, { withFileTypes: true });
  commandFiles.forEach(async (file) => {
    if (file.isDirectory()) {
      genCommand(path.join(folder, file.name), returnCollection);
      return;
    }
    if (!file.name.endsWith('.command.js')) return;
    const name = `./${path.join('.', folder, file.name).replace(/\\/g, '/')}`;

    try {
      const { default: command } = await import(`${name}`);
      if (command.aliases) {
        command.aliases.forEach((alias) => {
          returnCollection.set(alias.toLowerCase(), command);
        });
      }
      returnCollection.set(command.name.toLowerCase(), command);
      setCommandsInDatabase(command);
    } catch (e) {
      console.error(e);
    }
  });
}

const CommandHandler = () => {
  const commandDatabase = new db.table('commandsDatabase');

  const listDelete = commandDatabase.all();

  listDelete.forEach((comando) => {
    commandDatabase.delete(`${comando.ID}`);
  });

  const returnCollection = new Collection();

  if (commandFolders) {
    commandFolders.forEach((folder) => genCommand(folder, returnCollection));
  }
  return returnCollection;
};

export default CommandHandler;
