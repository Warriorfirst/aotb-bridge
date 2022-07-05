const DiscordCommand = require('../../contracts/DiscordCommand')

class ExecuteCommand extends DiscordCommand {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    super(discord)

    this.name = 'execute'
    this.aliases = ['exec', 'exe']
    this.description = 'Executes commands as the minecraft bot'

    /** @type {'everyone' | 'owner' | 'staff'} */
    this.permission = 'owner'
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  onCommand(message, args) {
    const command = args.join(' ')

    if (command.length == 0) {
      return message.reply(`No command specified`)
    }

    this.sendMinecraftMessage(`/${command}`)

    message.reply(`\`/${command}\` has been executed`)
  }
}

module.exports = ExecuteCommand
