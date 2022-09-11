const CommunicationBridge = require('../contracts/CommunicationBridge')
const StateHandler = require('./handlers/StateHandler')
const MessageHandler = require('./handlers/MessageHandler')
const CommandHandler = require('./handlers/CommandHandler')
const Discord = require('discord.js')

class DiscordManager extends CommunicationBridge {
  webhooks = {
    /** @type {import('discord.js').Webhook?} */
    guild: null,
    /** @type {import('discord.js').Webhook?} */
    officer: null,
  }

  channels = {
    /** @type {import('discord.js').TextChannel?} */
    guild: null,
    /** @type {import('discord.js').TextChannel?} */
    officer: null,
  }

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
      this.client = new Discord.Client({
        intents: [
          Discord.IntentsBitField.Flags.Guilds,
          Discord.IntentsBitField.Flags.GuildMessages,
          Discord.IntentsBitField.Flags.GuildIntegrations,
          Discord.IntentsBitField.Flags.GuildWebhooks,
        ],
      })

      this.client.on('ready', () => this.stateHandler.onReady().then(resolve))
      this.client.on('messageCreate', message => this.messageHandler.onMessage(message))

      this.client.login(this.app.config.discord.token)
    })
  }

  /**
   * @param {{username: string, message: string, guildRank: string, destination: 'guild' | 'officer', colour: number}} Content
   */
  async sendBotMessage({ username, message, guildRank, destination, colour }) {
    return await this.channels[destination]
      ?.send({
        embeds: [
          {
            description: message,
            color: colour,
            timestamp: new Date().toISOString(),
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
      .catch(this.app.log.error)
  }

  /**
   * @param {{username: string, message: string, destination: 'guild' | 'officer'}} Content
   */
  async sendWebhookMessage({ username, message, destination }) {
    message = message.replace(/@/g, '') // No pinging
    return await this.webhooks[destination]
      ?.send({
        username,
        content: message,
        avatarURL: 'https://www.mc-heads.net/avatar/' + username,
      })
      .catch(this.app.log.error)
  }

  /**
   * @param {import('discord.js').APIEmbed} embed
   * @param {'guild' | 'officer' | 'both'} destination
   */
  async sendEvent(embed, destination) {
    if (destination == 'both') {
      await this.channels['guild']?.send({ embeds: [embed] }).catch(this.app.log.error)
      return this.channels['officer']?.send({ embeds: [embed] }).catch(this.app.log.error)
    } else {
      return this.channels[destination]?.send({ embeds: [embed] }).catch(this.app.log.error)
    }
  }

  /**
   * @param {{ username: string, message: string, guildRank: string; destination: 'guild' | 'officer' }} Content
   */
  onBroadcast({ username, message, guildRank, destination }) {
    this.app.log.broadcast(`${destination == 'guild' ? 'Guild' : 'Officer'} > ${username} [${guildRank}]: ${message}`, `Discord`)
    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.sendBotMessage({ username, message, guildRank, destination, colour: 0x6495ed })
        break

      case 'webhook':
        this.sendWebhookMessage({ username, message, destination })
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }

  /**
   * @param {{message: string; color: number; destination: 'guild' | 'officer' | 'both'}} Content
   */
  onBroadcastCleanEmbed({ message, color, destination }) {
    this.app.log.broadcast(message, 'Event')

    this.sendEvent(
      {
        color: color,
        description: message,
      },
      destination
    )
  }

  /**
   * @param {{message: string; title: string; icon: string; color: number; destination: 'guild' | 'officer' | 'both'}} Content
   */
  onBroadcastHeadedEmbed({ message, title, icon, color, destination }) {
    this.app.log.broadcast(message, 'Event')

    this.sendEvent(
      {
        color: color,
        author: {
          name: title,
          icon_url: icon,
        },
        description: message,
      },
      destination
    )
  }

  /**
   * @param {{username: string; message: string; color?: number}} Content
   */
  onPlayerToggle({ username, message, color }) {
    this.app.log.broadcast(username + ' ' + message, 'Event')

    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.channels.guild
          ?.send({
            embeds: [
              {
                color,
                timestamp: new Date().toISOString(),
                author: {
                  name: `${username} ${message}`,
                  icon_url: 'https://www.mc-heads.net/avatar/' + username,
                },
              },
            ],
          })
          .catch(this.app.log.error)
        break

      case 'webhook':
        this.webhooks.guild
          ?.send({
            username: username,
            avatarURL: 'https://www.mc-heads.net/avatar/' + username,
            embeds: [
              {
                color: color,
                description: `${username} ${message}`,
              },
            ],
          })
          .catch(this.app.log.error)
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }
}

module.exports = DiscordManager
