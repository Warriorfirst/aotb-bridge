class MessageHandler {
  /**
   * @param {import('../DiscordManager')} discord
   * @param {import('./CommandHandler')} command
   */
  constructor(discord, command) {
    this.discord = discord
    this.command = command
  }

  /**
   * @param {import('discord.js').Message} message
   */
  async onMessage(message) {
    if (!this.shouldBroadcastMessage(message)) {
      return
    }

    const destination = message.channelId == this.discord.app.config.discord.channels.guild ? 'guild' : 'officer'

    if (this.command.handle(message)) {
      return
    }

    const content = this.stripDiscordContent(message.content).trim()
    if (content.length == 0) {
      return
    }

    this.discord.broadcastMessage({
      username: message.member?.displayName,
      message: this.stripDiscordContent(message.content),
      replyingTo: await this.fetchReply(message),
      destination,
    })
  }

  /**
   * @param {import('discord.js').Message} message
   */
  async fetchReply(message) {
    try {
      if (!message.reference || !message.reference.messageId) return

      const reference = await message.channel.messages.fetch(message.reference.messageId)

      return reference.member ? reference.member.displayName : reference.author.username
    } catch (e) {
      return
    }
  }

  /**
   * @param {string} message
   */
  stripDiscordContent(message) {
    return message
      .replace(/<[@|#|!|&]{1,2}(\d+){16,}>/g, '\n')
      .replace(/<:\w+:(\d+){16,}>/g, '\n')
      .replace(/[^\p{L}\p{N}\p{P}\p{Z}\+$\^\|~`<>]/gu, '\n')
      .split('\n')
      .map((/** @type {string} */ part) => {
        part = part.trim()

        return part.length == 0 ? '' : part + ' '
      })
      .join('')
  }

  /**
   * @param {import('discord.js').Message} message
   */
  shouldBroadcastMessage(message) {
    return !message.author.bot && (this.isGuildMessage(message) || this.isOfficerMessage(message)) && message.content && message.content.length > 0
  }

  /**
   * @param {import('discord.js').Message} message
   */
  isGuildMessage(message) {
    return message.channel.id == this.discord.app.config.discord.channels.guild
  }

  /**
   * @param {import('discord.js').Message} message
   */
  isOfficerMessage(message) {
    return message.channel.id == this.discord.app.config.discord.channels.officer
  }
}

module.exports = MessageHandler
