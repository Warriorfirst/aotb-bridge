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

    console.log(message.content)

    const destination = message.channelId == this.discord.app.config.discord.channels.guild ? 'guild' : 'officer'

    if (this.command.handle(message)) {
      return
    }

    const content = cleanContent(message.content, message.channel).replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '')

    if (content.length) {
      this.discord.broadcastMessage({
        username: message.member?.displayName,
        message: content,
        replyingTo: await this.fetchReply(message),
        destination,
      })
    }
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
   * @param {import('discord.js').Message} message
   */
  shouldBroadcastMessage(message) {
    return (
      !message.author.bot &&
      !message.webhookId &&
      (this.isGuildMessage(message) || this.isOfficerMessage(message)) &&
      message.content &&
      message.content.length > 0
    )
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

/**
 * @param {string} str
 * @param {import('discord.js').Channel} channel
 */
function cleanContent(str, channel) {
  return str.replace(/<(@[!&]?|#|a?:\w+?:)(\d{17,19})>/g, (match, type, id) => {
    switch (type) {
      case '@':
      case '@!': {
        if (!channel.isDMBased()) {
          const member = channel.guild?.members.cache.get(id)
          if (member) {
            return `@${member.displayName}`
          }
        }

        const user = channel.client.users.cache.get(id)
        return user ? `@${user.username}` : match
      }
      case '@&': {
        if (channel.isDMBased()) return match
        const role = channel.guild.roles.cache.get(id)
        return role ? `@${role.name}` : match
      }
      case '#': {
        if (channel.isDMBased()) return match
        const mentionedChannel = channel.client.channels.cache.get(id)
        return mentionedChannel && !mentionedChannel.isDMBased() ? `#${mentionedChannel.name}` : match
      }
      default: {
        if (type.match(/^:\w+?:$/)) return type
        return match
      }
    }
  })
}
