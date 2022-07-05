const DiscordCommand = require('../../contracts/DiscordCommand')

class SetRankCommand extends DiscordCommand {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    super(discord)

    this.name = 'setrank'
    this.aliases = ['rank', 'sr']
    this.description = 'Sets a users guild rank'
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  onCommand(message, args) {
    const user = args.shift()
    const rank = args.join(' ')

    this.sendMinecraftMessage(`/g setrank ${user} ${rank}`)
  }
}

module.exports = SetRankCommand
