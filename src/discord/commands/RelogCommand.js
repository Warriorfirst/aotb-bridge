const DiscordCommand = require('../../contracts/DiscordCommand')

class RelogCommand extends DiscordCommand {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    super(discord)

    this.name = 'relog'
    this.aliases = ['r']
    this.description = 'Relogs the minecraft client after a given period of time'
  }

  /**
   * @param {import('discord.js-light').Message} message
   */
  onCommand(message) {
    let args = this.getArgs(message)
    let timestr = args.pop()

    if (!timestr) {
      return this.relogWithDelay(message)
    }

    let delay = parseInt(timestr)
    if (isNaN(delay)) {
      return message.reply('Relog delay must be a number between 5 and 300!')
    }

    delay = Math.min(Math.max(delay, 5), 300)

    return this.relogWithDelay(message, delay)
  }

  /**
   * @param {import('discord.js-light').Message} message
   * @param {number} delay
   */
  relogWithDelay(message, delay = 0) {
    this.discord.app.minecraft && (this.discord.app.minecraft.stateHandler.exactDelay = delay * 1000)
    this.discord.app.minecraft?.bot?.quit('Relogging')

    message.reply(`The Minecraft account have disconnected from the server! Reconnecting in ${delay == 0 ? 5 : delay} seconds.`)
  }
}

module.exports = RelogCommand
