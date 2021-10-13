import Discord from 'discord.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

function getMessageCommands(listTempleteCategories, namesCategories) {
  return listTempleteCategories.reduce((prev, _arr, index) => {
    return `${prev}**${
      listTempleteCategories[index]
    }** \n ${`> ${namesCategories[
      listTempleteCategories[index]
    ].namesCommands.join(' **|** ')}`}\n\n`;
  }, '');
}

export function helpWithASpecificCommand(fullCommand, message) {
  const stringMarkedAliases = [];
  const stringMarkedPermissions = [];

  if (fullCommand.aliases) {
    for (let i = 0; i < fullCommand.aliases.length; i++) {
      stringMarkedAliases[i] = `\`${fullCommand.aliases[i]}\``;
    }
  }
  for (let i = 0; i < fullCommand.permissions.length; i++) {
    stringMarkedPermissions[i] = `\`${fullCommand.permissions[i]}\``;
  }

  const { category, description } = fullCommand;
  message.channel.send(
    message.author,
    new Discord.MessageEmbed()
      .setColor(Colors.pink_red)
      .setThumbnail(Icons.interrogation)
      .setTitle(`Informações sobre o comando \`${fullCommand.name}\`:`)
      .setDescription(
        `**📝 Categoria: ${
          category || 'Sem Categoria'
        }**\n\n**Sobre o Comando:**\n> \`\`${
          description || `Não especificado`
        }\`\`\n**Cargos necessários para utilizar o comando: **\n> ${
          stringMarkedPermissions.join(' | ') || '`Não especificado`'
        }\n**Sinônimos: **\n> ${
          stringMarkedAliases.join('**|**') ||
          '`<Este comando não possui sinônimos>`'
        }`
      )
  );
}

export default {
  name: 'help',
  description: `<prefix>help <comando> `,
  permissions: ['everyone'],
  aliases: ['ajuda', 'h'],
  category: 'Utility ⛏️',
  run: ({ message, client, args, prefix }) => {
    const commandsDatabase = new client.Database.table('commandsDatabase');

    const helpCommand = args[0]?.replace(prefix, '').toLowerCase();

    const fullCommand = commandsDatabase.get(`${helpCommand}`);

    if (!fullCommand) {
      const getNamesCommands = [];
      const allCommands = commandsDatabase.all();
      const namesCategories = {};

      for (let i = 0; i < allCommands.length; i++) {
        const commandAmongAll = JSON.parse(allCommands[i].data);

        const categoryCommand = commandAmongAll.category;

        if (namesCategories[categoryCommand]) {
          namesCategories[categoryCommand].namesCommands.push(
            `\`${prefix + commandAmongAll.name}\``
          );
        } else if (categoryCommand === undefined) {
          if (namesCategories['Sem categoria ❔']) {
            namesCategories['Sem categoria ❔'].namesCommands.push(
              `\`${prefix + commandAmongAll.name}\``
            );
          } else {
            namesCategories['Sem categoria ❔'] = {
              namesCommands: [`\`${prefix + commandAmongAll.name}\``],
            };
          }
        } else {
          namesCategories[categoryCommand] = {
            namesCommands: [`\`${prefix + commandAmongAll.name}\``],
          };
        }
      }
      const listTempleteCategories =
        Object.getOwnPropertyNames(namesCategories).sort();

      getNamesCommands.sort();
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setAuthor(
            'Balle Bot • Ballerini',
            client.user.displayAvatarURL({ dynamic: true }),
            'https://discord.gg/ballerini'
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Ajuda Sobre Comandos e Funções:`)
          .setDescription(
            `
            Hey ${
              message.author
            }, muito prazer! eu sou a Bot do servidor Ballerini (pode me chamar de Balle).\n
            Fui criada para várias funções dentro de um servidor,\n
            Entre elas: Moderação, Cargos, AntiSpam, Forbidden Words, Welcome, Eventos Especiais, Diversão, Economia, e muito mais!\n
            Meus criadores me criaram para ser um bot completo com praticamente tudo que é necessário para um servidor e um pouquinho a mais,
            trazendo segurança e diversão para o seu servidor!\n
            Caso queira suporte com nossos desenvolvedores entre em contato com a equipe responsável no servidor Ballerini:\n
            > **Ballerini:** https://discord.gg/ballerini \n

            **Essas são as categorias e comandos que podem ser usados: **\n
            ${getMessageCommands(listTempleteCategories, namesCategories)}`
          )
          .setFooter(
            `• Para saber as informações de um comando específico, use ${prefix}help <comando>`
          )
      );

      return;
    }
    helpWithASpecificCommand(fullCommand, message);
  },
};
