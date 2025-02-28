const DiscordCommand = require('../../contracts/DiscordCommand')

class UnmuteCommand extends DiscordCommand {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    super(discord)

    this.name = 'unmute'
    this.aliases = ['um']
    this.description = 'Unmutes the specified user'
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  onCommand(message, args) {
    let user = args.shift()

    this.sendMinecraftMessage(`/g unmute ${user ?? ''}`)
  }
}

module.exports = UnmuteCommand
