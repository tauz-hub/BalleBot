import { characteristicsCommandsDatabase } from './createDatabase.js'

export function dropChacaracteristicsInDatabase() {
    characteristicsCommandsDatabase.delete('nameCommand')
    characteristicsCommandsDatabase.delete('descriptionCommand')
    characteristicsCommandsDatabase.delete('permissionsCommand')
    characteristicsCommandsDatabase.delete('aliasesCommand')

    characteristicsCommandsDatabase.set('namesCommands', [])
    characteristicsCommandsDatabase.set('descriptionsCommands', [])
    characteristicsCommandsDatabase.set('permissionsCommands', [])
    characteristicsCommandsDatabase.set('aliasesCommands', [])
    return
}