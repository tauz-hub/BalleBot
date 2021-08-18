import { characteristicsCommandsDatabase } from './createDatabase.js'

export function getChacaracteristicsInDatabase() {

    let namesCommands = characteristicsCommandsDatabase.get('namesCommands'),
        descriptionsCommands = characteristicsCommandsDatabase.get('descriptionsCommands'),
        permissionsCommands = characteristicsCommandsDatabase.get('permissionsCommands'),
        aliasesCommands = characteristicsCommandsDatabase.get('aliasesCommands')

    return [namesCommands, descriptionsCommands, permissionsCommands, aliasesCommands]
}