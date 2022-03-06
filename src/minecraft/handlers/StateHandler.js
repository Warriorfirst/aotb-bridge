const EventHandler = require('../../contracts/EventHandler')

class StateHandler extends EventHandler {
  /**
   * @param {import('../MinecraftManager')} minecraft
   */
  constructor(minecraft) {
    super()

    this.minecraft = minecraft
    this.loginAttempts = 0
    this.exactDelay = 0
  }

  /**
   * @param {import('mineflayer').Bot} bot
   */
  registerEvents(bot) {
    this.bot = bot

    this.bot.on('login', () => this.onLogin())
    this.bot.on('end', () => this.onEnd())
    this.bot.on('kicked', reason => this.onKicked(reason))
  }

  onLogin() {
    this.minecraft.app.log.minecraft('Client ready, logged in as ' + this.bot?.username)

    this.loginAttempts = 0
    this.exactDelay = 0
  }

  onEnd() {
    let loginDelay = this.exactDelay
    if (loginDelay == 0) {
      loginDelay = (this.loginAttempts + 1) * 5000

      if (loginDelay > 60000) {
        loginDelay = 60000
      }
    }

    this.minecraft.app.log.warn(`Minecraft bot disconnected from server, attempting reconnect in ${loginDelay / 1000} seconds`)

    setTimeout(() => this.minecraft.connect(), loginDelay)
  }

  /**
   * @param {string} reason
   */
  onKicked(reason) {
    this.minecraft.app.log.warn(`Minecraft bot was kicked from server for "${reason}"`)

    this.loginAttempts++
  }
}

module.exports = StateHandler
