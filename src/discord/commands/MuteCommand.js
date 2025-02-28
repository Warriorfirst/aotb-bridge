const DiscordCommand = require('../../contracts/DiscordCommand')

class MuteCommand extends DiscordCommand {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    super(discord)

    this.name = 'mute'
    this.aliases = ['m']
    this.description = 'Mutes the given user for a given amount of time'
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  onCommand(message, args) {
    let user = args.shift()
    let time = args.shift()

    this.sendMinecraftMessage(`/g mute ${user ? user : ''} ${time ? time : ''}`)
  }
}

module.exports = MuteCommand
