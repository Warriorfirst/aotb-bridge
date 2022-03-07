const DiscordCommand = require('../../contracts/DiscordCommand')

class PromoteCommand extends DiscordCommand {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    super(discord)

    this.name = 'promote'
    this.aliases = ['p', 'up']
    this.description = 'Promotes the given user by one guild rank'
  }

  /**
   * @param {import('discord.js').Message} message
   */
  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()

    this.sendMinecraftMessage(`/g promote ${user ? user : ''}`)
  }
}

module.exports = PromoteCommand
