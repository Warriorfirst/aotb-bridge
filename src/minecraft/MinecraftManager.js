const CommunicationBridge = require('../contracts/CommunicationBridge')
const CommandHandler = require('./handlers/CommandHandler')
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
      host: this.app.config.server.host ?? 'mc.hypixel.io',
      port: this.app.config.server.port ?? 25565,
      username: 'Bridge',
      auth: process.env['NODE_ENV'] == 'DEVELOPMENT' ? undefined : 'microsoft',
      version: process.env['MINECRAFT_VERSION'] ?? '1.16.5',
      hideErrors: false, // Prevent an insane amount of spam caused by watchdog, unfortunately this seems to be the only way
      profilesFolder: './.minecraft', // Allow running multiple bridges at once with different accounts
    })
  }

  /**
   * @param {{username: string; message: string; replyingTo?: string; destination: 'guild' | 'officer'}} Content
   */
  onBroadcast({ username, message, replyingTo, destination }) {
    this.app.log.broadcast(`${username}: ${message}`, 'Minecraft')
    const commandPrefix = destination == 'guild' ? 'gc' : 'oc'
    const prefix = `/${commandPrefix} ${replyingTo ? `${username} replying to ${replyingTo}:` : `${username}:`} `
    const messages = this.splitMessage(prefix, message)

    const sendNextMessage = () => {
      const m = messages.shift()
      if (m) {
        this.bot?.chat(m)
        this.chatHandler.mostRecentChat = destination
      } else {
        clearInterval(interval)
      }
    }

    sendNextMessage()
    const interval = setInterval(sendNextMessage, 100) // 100 seems consistent. 50 is too low.
  }

  /**
   * @param {string} message
   * @param {string} prefix
   */
  splitMessage(prefix, message) {
    const lengthLimit = this.bot?.supportFeature('lessCharsInChat') ? 100 : 256
    /** @type {string[]} */
    const messages = []

    message.split('\n').forEach(line => {
      if (!line) return
      for (let i = 0; i < line.length; i += lengthLimit - prefix.length) {
        messages.push(prefix + line.substring(i, i + (lengthLimit - prefix.length)))
      }
    })

    return messages
  }
}

module.exports = MinecraftManager
