const CommunicationBridge = require('../contracts/CommunicationBridge')
const StateHandler = require('./handlers/StateHandler')
const MessageHandler = require('./handlers/MessageHandler')
const CommandHandler = require('./CommandHandler')
const Discord = require('discord.js')

class DiscordManager extends CommunicationBridge {
  /**
   * @type {import('discord.js').Webhook?} webhook
   */
  webhook = null

  /**
   * @type {import('discord.js').TextChannel?} app
   */
  channel = null

  /**
   * @param {import('../Application')} app
   */
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.messageHandler = new MessageHandler(this, new CommandHandler(this))
  }

  connect() {
    return new Promise(resolve => {
      this.client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS'] })

      this.client.on('ready', () => this.stateHandler.onReady().then(resolve))
      this.client.on('messageCreate', message => this.messageHandler.onMessage(message))

      this.client.login(this.app.config.discord.token)
    })
  }

  /**
   * @param {{username: string; message: string; guildRank: string}} Content
   */
  onBroadcast({ username, message, guildRank }) {
    this.app.log.broadcast(`${username} [${guildRank}]: ${message}`, `Discord`)
    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.channel?.send({
          embeds: [
            {
              description: message,
              color: 0x6495ed,
              timestamp: new Date(),
              footer: {
                text: guildRank,
              },
              author: {
                name: username,
                icon_url: 'https://www.mc-heads.net/avatar/' + username,
              },
            },
          ],
        })
        break

      case 'webhook':
        message = message.replace(/@/g, '') // Stop pinging @everyone or @here
        this.webhook?.send({ username: username, avatarURL: 'https://www.mc-heads.net/avatar/' + username, content: message })
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }

  /**
   * @param {{message: string; color: import('discord.js').ColorResolvable}} Content
   */
  onBroadcastCleanEmbed({ message, color }) {
    this.app.log.broadcast(message, 'Event')

    this.channel?.send({
      embeds: [
        {
          color: color,
          description: message,
        },
      ],
    })
  }

  /**
   * @param {{message: string; title: string; icon: string; color: import('discord.js').ColorResolvable}} Content
   */
  onBroadcastHeadedEmbed({ message, title, icon, color }) {
    this.app.log.broadcast(message, 'Event')

    this.channel?.send({
      embeds: [
        {
          color: color,
          author: {
            name: title,
            icon_url: icon,
          },
          description: message,
        },
      ],
    })
  }

  /**
   * @param {{username: string; message: string; color: import('discord.js').ColorResolvable}} Content
   */
  onPlayerToggle({ username, message, color }) {
    this.app.log.broadcast(username + ' ' + message, 'Event')

    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.channel?.send({
          embeds: [
            {
              color: color,
              timestamp: new Date(),
              author: {
                name: `${username} ${message}`,
                icon_url: 'https://www.mc-heads.net/avatar/' + username,
              },
            },
          ],
        })
        break

      case 'webhook':
        this.webhook?.send({
          username: username,
          avatarURL: 'https://www.mc-heads.net/avatar/' + username,
          embeds: [
            {
              color: color,
              description: `${username} ${message}`,
            },
          ],
        })
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }
}

module.exports = DiscordManager
