import { MessageEmbed } from 'discord.js';
import { prefix } from '../../assets/prefix.js';
import Colors from '../layoutEmbed/colors.js';

export function messageErro(client) {
  return new MessageEmbed()
    .setColor(Colors.pink_red)
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setTitle(`Os Cargos Administrativos não foram encontrados!:`)
    .setDescription(
      `**Desculpa, mas não encontrei os cargos marcados.**
      \n**•** Mande no seguinte esquema (o nome do cargo pode ser qualquer um):
      \n\`${prefix}setAdm @cargoPadawan @cargoMods @cargoStaff\``
    );
}
