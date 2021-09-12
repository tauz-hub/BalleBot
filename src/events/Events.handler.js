import path from 'path';
import { readdirSync } from 'fs';

const eventFolders = ['client', 'guild'];

const EventHandler = (client) => {
  if (eventFolders) {
    eventFolders.forEach((folder) => {
      const folderPath = path.resolve(
        path.dirname(''),
        'src',
        'events',
        folder
      );

      const eventFiles = readdirSync(folderPath).filter((file) =>
        file.endsWith('.event.js')
      );

      eventFiles.forEach(async (file) => {
        const { default: event } = await import(`./${folder}/${file}`);
        if (event.once) {
          client.once(event.name, (...args) => event.run(client, ...args));
        } else {
          client.on(event.name, (...args) => event.run(client, ...args));
        }
      });
    });
  }
};

export default EventHandler;
