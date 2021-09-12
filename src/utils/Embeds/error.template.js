import { MessageEmbed } from 'discord.js';
import { prefix } from '../../assets/prefix.js';

export function messageErro(client) {
  return new MessageEmbed()
    .setColor('#ff8997')
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setTitle(`Os Cargos Administrativos não foram encontrados!:`)
    .setDescription(
      `**Desculpa, mas não encontrei os cargos marcados.**
      \n**•** Mande no seguinte esquema (o nome do cargo pode ser qualquer um):
      \n\`${prefix}setAdm @cargoPadawan @cargoMods @cargoStaff\``
    );
}
