import Discord from 'discord.js';

export function messageWarnAndMute(message, client, messageMarked) {
  function messageDmAlert() {
    message.author
      .send(
        new Discord.MessageEmbed()
          .setColor('YELLOW')
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Você enviou uma mensagem suspeita:`)
          .setDescription(
            `**Espere um moderador rever seu caso, por hora você está silenciado do servidor!**
            \n**Essa foi a mensagem:**
            \n ${messageMarked}`
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
    guildIdDatabase.set(
      `user_id_${message.author.id}.name`,
      message.author.username
    );
    guildIdDatabase.set(
      `user_id_${message.author.id}.discriminator`,
      message.author.discriminator
    );
    guildIdDatabase.add(`user_id_${message.author.id}.warnsCount`, 1);
    guildIdDatabase.push(
      `user_id_${message.author.id}.reasons`,
      `Palavra/Link proibido : ${messageMarked}`
    );
    guildIdDatabase.push(
      `user_id_${message.author.id}.dataReasonsWarns`,
      new Date()
    );
  } else {
    guildIdDatabase.set(`user_id_${message.author.id}`, {
      name: message.author.username,
      discriminator: message.author.discriminator,
      id: message.author.id,
      warnsCount: 1,
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
          .setFooter(`usuário: ${message.author.id}`)
          .setDescription(`*Essa foi a mensagem:*\n ${messageMarked}`)
          .addFields({
            name: 'Mensagem enviada no canal:',
            value: message.channel,
          })
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      );
    }
  }
  messageDmAlert();
}
