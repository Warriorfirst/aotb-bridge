class DiscordCommand {
  /**
   * @param {import('../discord/DiscordManager')} discord
   */
  constructor(discord) {
    this.discord = discord
  }

  /**
   * @param {import('discord.js-light').Message} message
   */
  getArgs(message) {
    let args = message.content.split(' ')

    args.shift()

    return args
  }

  /**
   * @param {string} message
   */
  sendMinecraftMessage(message) {
    if (this.discord.app.minecraft?.bot?.player !== undefined) {
      this.discord.app.minecraft.bot.chat(message)
    }
  }

  /**
   * @param {import('discord.js-light').Message} message
   */
  onCommand(message) {
    throw new Error('Command onCommand method is not implemented yet!')
  }
}

module.exports = DiscordCommand
