const DiscordCommand = require('../../contracts/DiscordCommand')

class InviteCommand extends DiscordCommand {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    super(discord)

    this.name = 'invite'
    this.aliases = ['i', 'inv']
    this.description = 'Invites the given user to the guild'
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  onCommand(message, args) {
    let user = args.shift()

    this.sendMinecraftMessage(`/g invite ${user ? user : ''}`)
  }
}

module.exports = InviteCommand
