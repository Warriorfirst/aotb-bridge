const { TextChannel } = require('discord.js')

class StateHandler {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    this.discord = discord
  }

  async onReady() {
    this.discord.app.log.discord('Client ready, logged in as ' + this.discord.client?.user?.tag)
    this.discord.client?.user?.setActivity('Guild Chat', { type: 'WATCHING' })

    const channel = await this.discord.client?.channels.fetch(this.discord.app.config.discord.channel)

    if (channel && channel instanceof TextChannel) {
      this.discord.channel = channel
    } else {
      throw `Could not find channel ${this.discord.app.config.discord.channel}`
    }

    if (this.discord.app.config.discord.messageMode == 'webhook') {
      const webhook = await this.fetchWebhook()
      if (!webhook) throw "Couldn't find or setup a webhook"
      this.discord.webhook = webhook
    }
  }

  async fetchWebhook() {
    if (!this.discord.channel) throw `Could not find channel ${this.discord.app.config.discord.channel}`
    let webhooks = await this.discord.channel?.fetchWebhooks()

    if (webhooks.first()) {
      return webhooks.first()
    } else {
      var res = await this.discord.channel.createWebhook(this.discord.client?.user?.username ?? 'Chat Bridge', {
        avatar: this.discord.client?.user?.avatarURL() ?? undefined,
      })
      return res
    }
  }
}

module.exports = StateHandler
