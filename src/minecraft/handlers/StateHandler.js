const EventHandler = require('../../contracts/EventHandler')

class StateHandler extends EventHandler {
  hasSentLoginMessage = false

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
    this.bot.on('end', reason => this.onEnd(reason))
    this.bot.on('kicked', reason => this.onKicked(reason))

    process.on('SIGINT', async () => {
      await this.sendLogout('Process quit')
      process.exit(0)
    })
  }

  onLogin() {
    this.minecraft.app.log.minecraft('Client ready, logged in as ' + this.bot?.username)

    this.loginAttempts = 0
    this.exactDelay = 0

    if (!this.hasSentLoginMessage) {
      this.sendLogin()
      this.hasSentLoginMessage = true
    }
  }

  /**
   * @param {string} reason
   */
  onEnd(reason) {
    let loginDelay = this.exactDelay
    if (loginDelay == 0) {
      loginDelay = (this.loginAttempts + 1) * 5000

      if (loginDelay > 60000) {
        loginDelay = 60000
      }
    }

    this.minecraft.app.log.warn(`Minecraft bot disconnected from server, attempting reconnect in ${loginDelay / 1000} seconds`)

    setTimeout(() => this.minecraft.connect(), loginDelay)

    this.sendLogout(reason)
    this.hasSentLoginMessage = false
  }

  /**
   * @param {string} reason
   */
  onKicked(reason) {
    this.minecraft.app.log.warn(`Minecraft bot was kicked from server for "${reason}"`)

    this.loginAttempts++
  }

  sendLogin() {
    return this.minecraft.app.discord?.channel?.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Online` },
          color: 0x47f049,
        },
      ],
    })
  }

  /**
   * @param {string} reason
   */
  sendLogout(reason) {
    return this.minecraft.app.discord?.channel?.send({
      embeds: [
        {
          author: { name: `Chat Bridge is Offline` },
          description: `Reason: \`${reason}\``,
          color: 0xf04947,
        },
      ],
    })
  }
}

module.exports = StateHandler
