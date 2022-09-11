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
    this.bot.on('error', error => this.onError(error))

    process.on('SIGINT', async () => {
      await this.sendLogout('Process quit')
      process.exit(0)
    })
  }

  /**
   * @param {Error} error
   */
  onError(error) {
    this.minecraft.app.log.error(error.message)

    this.minecraft.app.discord?.sendEvent(
      {
        author: { name: 'Bot Error' },
        description: [`Name: \`${error.name}\``, `Mesage: \`${error.message}\``, `Trace: \`${error.stack}\``].join('\n'),
      },
      'officer'
    )

    this.minecraft.bot = this.minecraft.createBotConnection() // Try again I guess
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
    return this.minecraft.app.discord?.sendEvent(
      {
        author: { name: `Chat Bridge is Online` },
        description: `Connected to \`${this.minecraft.app.config.server.host}:${this.minecraft.app.config.server.port}\``,
        color: 0x47f049,
      },
      'both'
    )
  }

  /**
   * @param {string} reason
   */
  sendLogout(reason) {
    return this.minecraft.app.discord?.sendEvent(
      {
        author: { name: `Chat Bridge is Offline` },
        description: `Reason: \`${reason}\``,
        color: 0xf04947,
      },
      'both'
    )
  }
}

module.exports = StateHandler
