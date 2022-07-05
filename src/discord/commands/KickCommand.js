const DiscordCommand = require('../../contracts/DiscordCommand')

class KickCommand extends DiscordCommand {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    super(discord)

    this.name = 'kick'
    this.aliases = ['k']
    this.description = 'Kicks the given user from the guild'
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  onCommand(message, args) {
    let user = args.shift()
    let reason = args.join(' ')

    this.sendMinecraftMessage(`/g kick ${user ? user : ''} ${reason ? reason : ''}`)
  }
}

module.exports = KickCommand
