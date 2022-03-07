const CommunicationBridge = require('../contracts/CommunicationBridge')
const CommandHandler = require('./CommandHandler')
const StateHandler = require('./handlers/StateHandler')
const ErrorHandler = require('./handlers/ErrorHandler')
const ChatHandler = require('./handlers/ChatHandler')
const mineflayer = require('mineflayer')

class MinecraftManager extends CommunicationBridge {
  /**
   * @param {import('../Application')} app
   */
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.errorHandler = new ErrorHandler(this)
    this.chatHandler = new ChatHandler(this, new CommandHandler(this))
  }

  connect() {
    this.bot = this.createBotConnection()

    this.errorHandler.registerEvents(this.bot)
    this.stateHandler.registerEvents(this.bot)
    this.chatHandler.registerEvents(this.bot)
  }

  createBotConnection() {
    return mineflayer.createBot({
      host: this.app.config.server.host ?? 'mc.hypixel.net',
      port: this.app.config.server.port ?? 25565,
      username: 'Bridge',
      auth: process.env['NODE_ENV'] == 'DEVELOPMENT' ? undefined : 'microsoft',
      version: process.env['MINECRAFT_VERSION'] ?? '1.16.5',
      hideErrors: true, // Prevent an insane amount of spam caused by watchdog, unfortunately this seems to be the only way
    })
  }

  /**
   * @param {{username: string; message: string; replyingTo?: string}} Content
   */
  onBroadcast({ username, message, replyingTo }) {
    this.app.log.broadcast(`${username}: ${message}`, 'Minecraft')

    if (this.bot?.player !== undefined) {
      this.bot.chat(`/gc ${replyingTo ? `${username} replying to ${replyingTo}:` : `${username}:`} ${message}`)
    }
  }
}

module.exports = MinecraftManager
