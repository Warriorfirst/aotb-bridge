class DiscordCommand {
  /** @type {'everyone' | 'owner' | 'staff'} */
  permission = 'staff'

  /** @type {string} */
  name = 'Discord Command'

  /**
   * @param {import('../discord/DiscordManager')} discord
   */
  constructor(discord) {
    this.discord = discord
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
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  onCommand(message, args) {
    throw new Error('Command onCommand method is not implemented yet!')
  }
}

module.exports = DiscordCommand
