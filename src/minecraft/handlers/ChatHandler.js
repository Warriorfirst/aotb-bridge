const EventHandler = require('../../contracts/EventHandler')

class StateHandler extends EventHandler {
  /**
   * @type {'guild' | 'officer'}
   */
  mostRecentChat = 'guild'

  /**
   * @param {import('../MinecraftManager')} minecraft
   * @param {import("./CommandHandler")} command
   */
  constructor(minecraft, command) {
    super()

    this.minecraft = minecraft
    this.command = command
  }

  /**
   * @param {import('mineflayer').Bot} bot
   */
  registerEvents(bot) {
    this.bot = bot

    this.bot.on('message', jsonMessage => this.onMessage(jsonMessage))
  }

  /**
   * @param {import('prismarine-chat').ChatMessage} jsonMessage
   */
  onMessage(jsonMessage) {
    const message = jsonMessage.toString().trim()
    console.log(message)

    if (this.isLobbyJoinMessage(message)) {
      this.minecraft.app.log.minecraft('Sending Minecraft client to limbo')
      return this.bot?.chat('§')
    }

    if (this.isLoginMessage(message)) {
      let user = message.split('>')[1].trim().split('joined.')[0].trim()

      return this.minecraft.broadcastPlayerToggle({ username: user, message: `joined.`, color: 0x47f049 })
    }

    if (this.isLogoutMessage(message)) {
      let user = message.split('>')[1].trim().split('left.')[0].trim()

      return this.minecraft.broadcastPlayerToggle({ username: user, message: `left.`, color: 0xf04947 })
    }

    if (this.isJoinMessage(message)) {
      let user = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[0]

      return this.minecraft.broadcastHeadedEmbed({
        message: `${user} joined the guild!`,
        title: `Member Joined`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 0x47f049,
        destination: 'both',
      })
    }

    if (this.isLeaveMessage(message)) {
      let user = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[0]

      return this.minecraft.broadcastHeadedEmbed({
        message: `${user} left the guild!`,
        title: `Member Left`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 0xf04947,
        destination: 'both',
      })
    }

    if (this.isKickMessage(message)) {
      let user = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[0]

      return this.minecraft.broadcastHeadedEmbed({
        message: `${user} was kicked from the guild!`,
        title: `Member Kicked`,
        icon: `https://mc-heads.net/avatar/${user}`,
        color: 0xf04947,
        destination: 'both',
      })
    }

    if (this.isPromotionMessage(message)) {
      let username = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[0]
      let newRank = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(' to ')
        .pop()
        ?.trim()

      return this.minecraft.broadcastCleanEmbed({ message: `${username} was promoted to ${newRank}`, color: 0x47f049, destination: 'both' })
    }

    if (this.isDemotionMessage(message)) {
      let username = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[0]
      let newRank = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(' to ')
        .pop()
        ?.trim()

      return this.minecraft.broadcastCleanEmbed({ message: `${username} was demoted to ${newRank}`, color: 0xf04947, destination: 'both' })
    }

    if (this.isBlockedMessage(message)) {
      let blockedMsg = message.match(/".+"/g)?.at(0)?.slice(1, -1)

      return this.minecraft.broadcastCleanEmbed({ message: `Message \`${blockedMsg}\` blocked by Hypixel.`, color: 0xdc143c, destination: this.mostRecentChat })
    }

    if (this.isRepeatMessage(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: `You cannot say the same message twice!`, color: 0xdc143c, destination: this.mostRecentChat })
    }

    if (this.isNoPermission(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: `I don't have permission to do that!`, color: 0xdc143c, destination: 'officer' })
    }

    if (this.isIncorrectUsage(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: message.split("'").join('`'), color: 0xdc143c, destination: 'officer' })
    }

    if (this.isOnlineInvite(message)) {
      let user = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[2]

      return this.minecraft.broadcastCleanEmbed({ message: `${user} was invited to the guild!`, color: 0x47f049, destination: 'officer' })
    }

    if (this.isOfflineInvite(message)) {
      let user = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[6]
        .match(/\w+/g)
        ?.at(0)

      return this.minecraft.broadcastCleanEmbed({ message: `${user} was offline invited to the guild!`, color: 0x47f049, destination: 'officer' })
    }

    if (this.isFailedInvite(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: message.replace(/\[(.*?)\]/g, '').trim(), color: 0xdc143c, destination: 'officer' })
    }

    if (this.isGuildMuteMessage(message)) {
      let time = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[7]

      return this.minecraft.broadcastCleanEmbed({ message: `Guild Chat has been muted for ${time}`, color: 0xf04947, destination: 'both' })
    }

    if (this.isGuildUnmuteMessage(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: `Guild Chat has been unmuted!`, color: 0x47f049, destination: 'both' })
    }

    if (this.isUserMuteMessage(message)) {
      let user = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[3]
        .replace(/[^\w]+/g, '')
      let time = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[5]

      return this.minecraft.broadcastCleanEmbed({ message: `${user} has been muted for ${time}`, color: 0xf04947, destination: 'officer' })
    }

    if (this.isUserUnmuteMessage(message)) {
      let user = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(/ +/g)[3]

      return this.minecraft.broadcastCleanEmbed({ message: `${user} has been unmuted!`, color: 0x47f049, destination: 'officer' })
    }

    if (this.isSetrankFail(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: `Rank not found.`, color: 0xdc143c, destination: 'officer' })
    }

    if (this.isAlreadyMuted(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: `This user is already muted!`, color: 0xdc143c, destination: 'officer' })
    }

    if (this.isNotMuted(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: `This user is not muted!`, color: 0xdc143c, destination: 'officer' })
    }

    if (this.isNotInGuild(message)) {
      let user = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(' ')[0]

      return this.minecraft.broadcastCleanEmbed({ message: `${user} is not in the guild.`, color: 0xdc143c, destination: 'officer' })
    }

    if (this.isLowestRank(message)) {
      let user = message
        .replace(/\[(.*?)\]/g, '')
        .trim()
        .split(' ')[0]

      return this.minecraft.broadcastCleanEmbed({ message: `${user} is already the lowest guild rank!`, color: 0xdc143c, destination: 'officer' })
    }

    if (this.isAlreadyHasRank(message)) {
      return this.minecraft.broadcastCleanEmbed({ message: `They already have that rank!`, color: 0xdc143c, destination: 'officer' })
    }

    if (this.isTooFast(message)) {
      return this.minecraft.app.log.warn(message)
    }

    if (this.isPlayerNotFound(message)) {
      let user = message.split(' ')[8].slice(1, -1)

      return this.minecraft.broadcastCleanEmbed({ message: `Player \`${user}\` not found.`, color: 0xdc143c, destination: 'officer' })
    }

    if (this.isDirectMessage(message)) {
      const username = message.split(':')[0].split(' ').pop()
      let command = message.split(': ').slice(1).join(': ')

      if (!username || !message) return this.minecraft.app.log.warn(`Direct message ${message} could not have username/message extracted.`)
      this.command.handle(username, command)
      return
    }

    if (!this.isGuildMessage(message) && !this.isOfficerMessage(message)) {
      return
    }

    const destination = this.isGuildMessage(message) ? 'guild' : 'officer'

    let parts = message.split(':')
    // @ts-ignore
    let group = parts.shift().trim()
    let hasRank = group.endsWith(']')

    let userParts = group.split(' ')
    let username = userParts[userParts.length - (hasRank ? 2 : 1)]

    if (this.isMessageFromBot(username)) {
      return
    }

    const playerMessage = parts.join(':').trim()
    if (playerMessage.length == 0) {
      return
    }

    let guildRank = userParts[userParts.length - 1].replace(/[\[\]]/g, '')

    if (guildRank == username) {
      guildRank = 'Member'
    }

    if (playerMessage == '@') {
      return
    }

    this.minecraft.broadcastMessage({
      username: username,
      message: playerMessage,
      guildRank: guildRank,
      destination,
    })
  }

  /**
   * @param {string} username
   */
  isMessageFromBot(username) {
    return this.bot?.username === username
  }

  /**
   * @param {string} message
   */
  isLobbyJoinMessage(message) {
    return (message.endsWith(' the lobby!') || message.endsWith(' the lobby! <<<')) && message.includes('[MVP+')
  }

  /**
   * @param {string} message
   */
  isGuildMessage(message) {
    return message.startsWith('Guild >') && message.includes(':')
  }

  /**
   * @param {string} message
   */
  isOfficerMessage(message) {
    return message.startsWith('Officer >') && message.includes(':')
  }

  /**
   * @param {string} message
   */
  isDirectMessage(message) {
    return message.startsWith('From ') && message.includes(':')
  }

  /**
   * @param {string} message
   */
  isLoginMessage(message) {
    return message.startsWith('Guild >') && message.endsWith('joined.') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isLogoutMessage(message) {
    return message.startsWith('Guild >') && message.endsWith('left.') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isJoinMessage(message) {
    return message.includes('joined the guild!') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isLeaveMessage(message) {
    return message.includes('left the guild!') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isKickMessage(message) {
    return message.includes('was kicked from the guild by') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isPromotionMessage(message) {
    return message.includes('was promoted from') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isDemotionMessage(message) {
    return message.includes('was demoted from') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isBlockedMessage(message) {
    return message.startsWith('We blocked your comment')
  }

  /**
   * @param {string} message
   */
  isRepeatMessage(message) {
    return message == 'You cannot say the same message twice!'
  }

  /**
   * @param {string} message
   */
  isNoPermission(message) {
    return (
      (message.includes('You must be the Guild Master to use that command!') ||
        message.includes('You do not have permission to use this command!') ||
        message.includes(
          "I'm sorry, but you do not have permission to perform this command. Please contact the server administrators if you believe that this is in error."
        ) ||
        message.includes('You cannot mute a guild member with a higher guild rank!') ||
        message.includes('You cannot kick this player!') ||
        message.includes('You can only promote up to your own rank!') ||
        message.includes('You cannot mute yourself from the guild!') ||
        message.includes("is the guild master so can't be demoted!") ||
        message.includes("is the guild master so can't be promoted anymore!")) &&
      !message.includes(':')
    )
  }

  /**
   * @param {string} message
   */
  isIncorrectUsage(message) {
    return message.includes('Invalid usage!') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isOnlineInvite(message) {
    return message.includes('You invited') && message.includes('to your guild. They have 5 minutes to accept.') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isOfflineInvite(message) {
    return (
      message.includes('You sent an offline invite to') &&
      message.includes('They will have 5 minutes to accept once they come online!') &&
      !message.includes(':')
    )
  }

  /**
   * @param {string} message
   */
  isFailedInvite(message) {
    return (
      (message.includes('is already in another guild!') ||
        message.includes('You cannot invite this player to your guild!') ||
        (message.includes("You've already invited") && message.includes('to your guild! Wait for them to accept!')) ||
        message.includes('is already in your guild!')) &&
      !message.includes(':')
    )
  }

  /**
   * @param {string} message
   */
  isUserMuteMessage(message) {
    return message.includes('has muted') && message.includes('for') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isUserUnmuteMessage(message) {
    return message.includes('has unmuted') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isGuildMuteMessage(message) {
    return message.includes('has muted the guild chat for') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isGuildUnmuteMessage(message) {
    return message.includes('has unmuted the guild chat!') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isSetrankFail(message) {
    return message.includes("I couldn't find a rank by the name of ") && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isAlreadyMuted(message) {
    return message.includes('This player is already muted!') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isNotMuted(message) {
    return message.includes('This player is not muted!') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isNotInGuild(message) {
    return message.includes(' is not in your guild!') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isLowestRank(message) {
    return message.includes("is already the lowest rank you've created!") && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isAlreadyHasRank(message) {
    return message.includes('They already have that rank!') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isTooFast(message) {
    return message.includes('You are sendingcommands too fast! Please slow down.') && !message.includes(':')
  }

  /**
   * @param {string} message
   */
  isPlayerNotFound(message) {
    return message.startsWith(`Can't find a player by the name of`)
  }
}

module.exports = StateHandler
