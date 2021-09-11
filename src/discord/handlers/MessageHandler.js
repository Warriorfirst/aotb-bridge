class MessageHandler {
  constructor(discord) {
    this.discord = discord
  }

  async onMessage(message) {
    if (!this.shouldBroadcastMessage(message)) {
      return
    }

    const content = this.stripDiscordContent(message.content).trim()
    if (content.length == 0) {
      return
    }

    switch (message.channel.id) {
      case this.discord.app.config.discord.guildChannel:
        return this.discord.broadcastGuildMessage({
          username: message.member.displayName,
          message: this.stripDiscordContent(message.content),
          replyingTo: await this.fetchReply(message),
        })
      case this.discord.app.config.discord.officerChannel:
        return this.discord.broadcastOfficerMessage({
          username: message.member.displayName,
          message: this.stripDiscordContent(message.content),
          replyingTo: await this.fetchReply(message),
        })
    }
  }

  async fetchReply(message) {
    try {
      if (!message.reference) return null

      const reference = await message.channel.messages.fetch(message.reference.messageID)

      return reference.member ? reference.member.displayName : reference.author.username
    } catch (e) {
      return null
    }
  }

  stripDiscordContent(message) {
    return message
      .replace(/<[@|#|!|&]{1,2}(\d+){16,}>/g, '\n')
      .replace(/<:\w+:(\d+){16,}>/g, '\n')
      .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '\n')
      .split('\n')
      .map(part => {
        part = part.trim()

        return part.length == 0 ? '' : part + ' '
      })
      .join('')
  }

  shouldBroadcastMessage(message) {
    return (
      !message.author.bot &&
      (message.channel.id == this.discord.app.config.discord.guildChannel || message.channel.id == this.discord.app.config.discord.officerChannel) &&
      message.content &&
      message.content.length > 0
    )
  }
}

module.exports = MessageHandler
