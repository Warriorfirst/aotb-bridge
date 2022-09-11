const { TextChannel, ActivityType } = require('discord.js')

class StateHandler {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    this.discord = discord
  }

  async onReady() {
    this.discord.app.log.discord('Client ready, logged in as ' + this.discord.client?.user?.tag)
    this.discord.client?.user?.setActivity('Guild Chat', { type: ActivityType.Watching })

    const guildChannel = await this.discord.client?.channels.fetch(this.discord.app.config.discord.channels.guild)
    const officerChannel = await this.discord.client?.channels.fetch(this.discord.app.config.discord.channels.officer)

    if (guildChannel && guildChannel instanceof TextChannel) {
      this.discord.channels.guild = guildChannel
    } else {
      throw `Could not find channel ${this.discord.app.config.discord.channels.guild}`
    }

    if (officerChannel && officerChannel instanceof TextChannel) {
      this.discord.channels.officer = officerChannel
    } else {
      throw `Could not find channel ${this.discord.app.config.discord.channels.officer}`
    }

    if (this.discord.app.config.discord.messageMode == 'webhook') {
      const guildWebhook = await this.fetchWebhook(guildChannel)
      if (!guildWebhook) throw "Couldn't find or setup a webhook for Guild channel"
      this.discord.webhooks.guild = guildWebhook

      const officerWebhook = await this.fetchWebhook(officerChannel)
      if (!officerWebhook) throw "Couldn't find or setup a webhook for Guild channel"
      this.discord.webhooks.officer = officerWebhook
    }
  }

  /**
   * @param {import('discord.js').TextChannel} channel
   */
  async fetchWebhook(channel) {
    let webhooks = await channel.fetchWebhooks()

    if (webhooks.first()) {
      return webhooks.first()
    } else {
      var res = await channel.createWebhook({
        name: this.discord.client?.user?.username ?? 'Chat Bridge',
        avatar: this.discord.client?.user?.avatarURL() ?? undefined,
      })
      return res
    }
  }
}

module.exports = StateHandler
