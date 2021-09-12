import path from 'path';
import { readdirSync } from 'fs';
import { Collection } from 'discord.js';

const reactionFolders = ['championship'];

const ReactionHandler = () => {
  const returnCollection = new Collection();

  if (reactionFolders) {
    reactionFolders.forEach((folder) => {
      const folderPath = path.resolve(
        path.dirname(''),
        'src',
        'reactionAdd',
        folder
      );

      const reactionFiles = readdirSync(folderPath).filter((file) =>
        file.endsWith('.reaction.js')
      );

      reactionFiles.forEach(async (file) => {
        const { default: reaction } = await import(`./${folder}/${file}`);
        returnCollection.set(reaction.name.toLowerCase(), reaction);
      });
    });
  }

  return returnCollection;
};

export default ReactionHandler;
