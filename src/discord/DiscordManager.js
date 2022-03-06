const CommunicationBridge = require('../contracts/CommunicationBridge')
const StateHandler = require('./handlers/StateHandler')
const MessageHandler = require('./handlers/MessageHandler')
const CommandHandler = require('./CommandHandler')
const Discord = require('discord.js-light')

class DiscordManager extends CommunicationBridge {
  /**
   * @type {import('discord.js-light').Webhook?} webhook
   */
  webhook = null

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
    this.client = new Discord.Client({
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: false,
      cachePresences: false,
    })

    this.client.on('ready', () => this.stateHandler.onReady())
    this.client.on('message', message => this.messageHandler.onMessage(message))

    this.client.login(this.app.config.discord.token).catch(error => {
      this.app.log.error(error)

      process.exit(1)
    })

    process.on('SIGINT', () => this.stateHandler.onClose())
  }

  /**
   * @param {{username: string; message: string; guildRank: string}} Content
   */
  onBroadcast({ username, message, guildRank }) {
    this.app.log.broadcast(`${username} [${guildRank}]: ${message}`, `Discord`)
    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.client?.channels.fetch(this.app.config.discord.channel).then((/** @type {import('discord.js-light').Channel} */ channel) => {
          channel.isText() &&
            channel.send({
              embed: {
                description: message,
                color: '6495ED',
                timestamp: new Date(),
                footer: {
                  text: guildRank,
                },
                author: {
                  name: username,
                  icon_url: 'https://www.mc-heads.net/avatar/' + username,
                },
              },
            })
        })
        break

      case 'webhook':
        message = message.replace(/@/g, '') // Stop pinging @everyone or @here
        this.webhook?.send(message, { username: username, avatarURL: 'https://www.mc-heads.net/avatar/' + username })
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }

  /**
   * @param {{message: string; color: import('discord.js-light').ColorResolvable}} Content
   */
  onBroadcastCleanEmbed({ message, color }) {
    this.app.log.broadcast(message, 'Event')

    this.client?.channels.fetch(this.app.config.discord.channel).then((/** @type {import('discord.js-light').Channel} */ channel) => {
      channel.isText() &&
        channel.send({
          embed: {
            color: color,
            description: message,
          },
        })
    })
  }

  /**
   * @param {{message: string; title: string; icon: string; color: import('discord.js-light').ColorResolvable}} Content
   */
  onBroadcastHeadedEmbed({ message, title, icon, color }) {
    this.app.log.broadcast(message, 'Event')

    this.client?.channels.fetch(this.app.config.discord.channel).then((/** @type {import('discord.js-light').Channel} */ channel) => {
      channel.isText() &&
        channel.send({
          embed: {
            color: color,
            author: {
              name: title,
              icon_url: icon,
            },
            description: message,
          },
        })
    })
  }

  /**
   * @param {{username: string; message: string; color: import('discord.js-light').ColorResolvable}} Content
   */
  onPlayerToggle({ username, message, color }) {
    this.app.log.broadcast(username + ' ' + message, 'Event')

    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.client?.channels.fetch(this.app.config.discord.channel).then((/** @type {import('discord.js-light').Channel} */ channel) => {
          channel.isText() &&
            channel.send({
              embed: {
                color: color,
                timestamp: new Date(),
                author: {
                  name: `${username} ${message}`,
                  icon_url: 'https://www.mc-heads.net/avatar/' + username,
                },
              },
            })
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
