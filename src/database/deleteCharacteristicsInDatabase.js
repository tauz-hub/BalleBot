import { characteristicsCommandsDatabase } from './createDatabase'

export function deleteCharacteristicsInDatabase(name) {
    let namesCommandsList = characteristicsCommandsDatabase.get('namesCommands')

    let count = 0;
    namesCommandsList.forEach(nameCommand => {
        if (name === nameCommand) {
            characteristicsCommandsDatabase.delete(`namesCommands.${count}`)
            characteristicsCommandsDatabase.delete(`descriptionsCommands.${count}`)
            characteristicsCommandsDatabase.delete(`permissionsCommands.${count}`)
            characteristicsCommandsDatabase.delete(`aliasesCommands.${count}`)
            return
        }
        count++;
    });
}