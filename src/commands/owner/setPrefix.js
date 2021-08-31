import Discord from 'discord.js'
import { prefix } from '../../assets/prefix.js'

export default {
    name: 'setPrefix',
    description: `comando setar um prefixo customizado para seu servidor, para isso use ${prefix}setPrefix <prefix>`,
    permissions: ['everyone'],
    aliases: ['prefix'],
    category: 'Acessórios ✨',
    run: ({ message, client }) => {

    }
};