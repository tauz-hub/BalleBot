import path from 'path';
import { readdirSync } from 'fs';
import { Collection } from 'discord.js';
import { setCharacteristicsInDatabase } from '../database/setCharacteristicsInDatabase.js'
import { dropChacaracteristicsInDatabase } from '../database/dropChacaracteristicsInDatabase.js'

const commandFolders = ['everyone', 'padawan', 'mods', 'staff'];

const CommandHandler = () => {
    const returnCollection = new Collection();

    if (commandFolders) {
        dropChacaracteristicsInDatabase()
        commandFolders.forEach((folder) => {
            const folderPath = path.resolve(
                path.dirname(''),
                'src',
                'commands',
                folder
            );
            const commandFiles = readdirSync(folderPath).filter((file) => file.endsWith('.js'));

            commandFiles.forEach(async(file) => {

                const { default: command } = await
                import (`./${folder}/${file}`);

                if (command.aliases) {
                    command.aliases.map((alias) => {
                        returnCollection.set(alias.toLowerCase(), command)
                    })
                }
                returnCollection.set(command.name.toLowerCase(), command);

                setCharacteristicsInDatabase(command.name, command.description, command.permissions, command.aliases)
            });
        });
    }
    return returnCollection;
};
export default CommandHandler;