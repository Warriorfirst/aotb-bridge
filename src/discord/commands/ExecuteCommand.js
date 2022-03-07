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
  }

  /**
   * @param {import('discord.js').Message} message
   */
  onCommand(message) {
    let args = this.getArgs(message).join(' ')

    if (args.length == 0) {
      return message.reply(`No command specified`)
    }

    this.sendMinecraftMessage(`/${args}`)

    message.reply(`\`/${args}\` has been executed`)
  }
}

module.exports = ExecuteCommand
