class MinecraftCommand {
  /**
   * @param {import('../minecraft/MinecraftManager')} minecraft
   */
  constructor(minecraft) {
    this.minecraft = minecraft
  }

  /**
   * @param {string} message
   */
  getArgs(message) {
    let args = message.split(' ')

    args.shift()

    return args
  }

  /**
   * @param {string} message
   */
  send(message) {
    if (this.minecraft.bot?.player !== undefined) {
      this.minecraft.bot.chat(message)
    }
  }

  /**
   * @param {string} user
   * @param {string} message
   */
  reply(user, message) {
    if (this.minecraft.bot?.player) {
      this.minecraft.bot.chat(`/w ${user.trim()} ${message}`)
    }
  }

  /**
   * @param {any} player
   * @param {any} message
   */
  onCommand(player, message) {
    throw new Error('Command onCommand method is not implemented yet!')
  }
}

module.exports = MinecraftCommand
