import Discord from 'discord.js';

export async function messageWarnAndMute(message, client, messageMarked) {
  function messageDmAlert() {
    message.author
      .send(
        new Discord.MessageEmbed()
          .setColor('YELLOW')
          .setThumbnail(message.guild.iconURL())
          .setTitle(`Você enviou uma mensagem suspeita em ${message.guild}:`)
          .setDescription(
            `**Um moderador irá rever seu caso!**
            \n**Essa foi a mensagem:**
            ${messageMarked}`
          )
          .addFields({
            name: 'Mensagem enviada no canal:',
            value: message.channel,
          })
          .setTimestamp()
      )
      .catch();
  }

  message.channel
    .send(
      message.author,
      new Discord.MessageEmbed()
        .setColor('YELLOW')
        .setTitle(
          `${message.author.tag} você usou uma palavra ou link proibido e recebeu +1 warn, não use novamente ou será banido⚠️`
        )
    )
    .then((msg) => msg.delete({ timeout: 15000 }));

  const guildIdDatabase = new client.Database.table(
    `guild_id_${message.guild.id}`
  );

  if (guildIdDatabase.has(`user_id_${message.author.id}`)) {
    guildIdDatabase.push(
      `user_id_${message.author.id}.reasons`,
      `Palavra/Link proibido : ${messageMarked}`
    );
    guildIdDatabase.push(
      `user_id_${message.author.id}.dataReasonsWarns`,
      new Date()
    );
    guildIdDatabase.push(`user_id_${message.author.id}.autor`, client.user.id);
  } else {
    guildIdDatabase.set(`user_id_${message.author.id}`, {
      id: message.author.id,
      autor: [client.user.id],
      reasons: [`Palavra/Link proibido : ${messageMarked}`],
      dataReasonsWarns: [new Date()],
    });
  }

  if (guildIdDatabase.has('channel_log')) {
    const channel = client.channels.cache.get(
      guildIdDatabase.get('channel_log')
    );

    if (channel) {
      channel.send(
        new Discord.MessageEmbed()
          .setColor('YELLOW')
          .setTitle(
            `Usuário ${message.author.tag} enviou uma mensagem suspeita:`
          )
          .setTimestamp()
          .setAuthor(
            `${message.author.tag}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setFooter(`ID do usuário: ${message.author.id}`)
          .addFields(
            {
              name: 'Essa foi a mensagem:',
              value: messageMarked,
            },
            {
              name: 'Mensagem enviada no canal:',
              value: message.channel,
            }
          )
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      );
    }
  }
  await message.delete();
  messageDmAlert();
}
