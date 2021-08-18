import { characteristicsCommandsDatabase } from './createDatabase.js'

export function setCharacteristicsInDatabase(name, description, permissions, aliases) {

    let namesCommandsList = characteristicsCommandsDatabase.get('namesCommands')

    let count = 0;
    namesCommandsList.forEach(nameCommand => {
        if (name === nameCommand) {
            characteristicsCommandsDatabase.set(`descriptionsCommands.${count}`, description)
            characteristicsCommandsDatabase.set(`permissionsCommands.${count}`, permissions)
            characteristicsCommandsDatabase.set(`aliasesCommands.${count}`, aliases)
            return
        }
        count++;
    });

    characteristicsCommandsDatabase.push('namesCommands', name.toLowerCase())
    characteristicsCommandsDatabase.push('descriptionsCommands', description)
    characteristicsCommandsDatabase.push('permissionsCommands', permissions)
    characteristicsCommandsDatabase.push('aliasesCommands', aliases)

}