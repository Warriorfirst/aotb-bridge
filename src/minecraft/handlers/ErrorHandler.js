const EventHandler = require('../../contracts/EventHandler')

class StateHandler extends EventHandler {
  /**
   * @param {import('../MinecraftManager')} minecraft
   */
  constructor(minecraft) {
    super()

    this.minecraft = minecraft
  }

  /**
   * @param {import('mineflayer').Bot} bot
   */
  registerEvents(bot) {
    this.bot = bot

    this.bot.on('error', error => this.onError(error))
  }

  /**
   * @param {Error} error
   */
  onError(error) {
    /**
     * @todo Add error type checking back here
     */
    this.minecraft.app.log.error(error.message)
  }
}

module.exports = StateHandler
