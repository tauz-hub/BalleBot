import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'

export default {
    name: 'addRole',
    description: `comando de adicionar cargos para uma mensagem de 'cargos por reação', use ${prefix}addRole <@cargo> <emoji>`,
    permissions: ['mods'],
    aliases: ['addroles'],
    category: 'Roles 📜',
    run: ({ message, client }) => {
        //TODO bot de cargos e reações
    }
};