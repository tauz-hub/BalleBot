import db from 'quick.db'
const commandsDatabase = new db.table('commandsDatabase')

export function setCommandsInDatabase(command) {

    //console.log(command)
    const nameCommand = command.name;
    // delete command.name
    const dataCommand = JSON.stringify(command)

    //console.log(dataCommand)
    commandsDatabase.set(`${nameCommand}`, `${dataCommand}`)

    // let allCommands = commandsDatabase.all()
}