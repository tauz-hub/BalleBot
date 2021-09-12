import db from 'quick.db';

const commandsDatabase = new db.table('commandsDatabase');

export function setCommandsInDatabase(command) {
  const nameCommand = command.name.toLowerCase();

  commandsDatabase.set(`${nameCommand}`, command);
}
