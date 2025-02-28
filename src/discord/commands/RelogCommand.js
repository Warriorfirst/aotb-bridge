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

    /** @type {'everyone' | 'owner' | 'staff'} */
    this.permission = 'owner'
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  onCommand(message, args) {
    let timestr = args.shift()

    if (!timestr) {
      return this.relogWithDelay(message)
    }

    let delay = parseInt(timestr)
    if (isNaN(delay)) {
      return message.reply({ content: 'Relog delay must be a number between 5 and 300!', allowedMentions: { parse: [] } })
    }

    delay = Math.min(Math.max(delay, 5), 300)

    return this.relogWithDelay(message, delay)
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {number} delay
   */
  relogWithDelay(message, delay = 0) {
    this.discord.app.minecraft && (this.discord.app.minecraft.stateHandler.exactDelay = delay * 1000)
    this.discord.app.minecraft?.bot?.quit('Relogging')

    message.reply({
      content: `The Minecraft account have disconnected from the server! Reconnecting in ${delay == 0 ? 5 : delay} seconds.`,
      allowedMentions: { parse: [] },
    })
  }
}

module.exports = RelogCommand
