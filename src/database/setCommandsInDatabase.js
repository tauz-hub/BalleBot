import db from 'quick.db'
const commandsDatabase = new db.table('commandsDatabase')

export function setCommandsInDatabase(command) {

    //console.log(command)
    const nameCommand = command.name;
    // delete command.name


    //console.log(dataCommand)
    commandsDatabase.set(`${nameCommand}`, command)

    // let allCommands = commandsDatabase.all()
}