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

    if (this.discord.app.config.discord.messageMode == 'webhook') {
      const webhook = await getWebhook(this.discord)
      if (!webhook) throw "Couldn't find or setup a webhook"
      this.discord.webhook = webhook
    }

    this.discord.client?.channels.fetch(this.discord.app.config.discord.channel).then(channel => {
      channel?.isText() &&
        channel.send({
          embeds: [
            {
              author: { name: `Chat Bridge is Online` },
              color: 0x47f049,
            },
          ],
        })
    })
  }

  onClose() {
    this.discord.client?.channels
      .fetch(this.discord.app.config.discord.channel)
      .then(channel => {
        channel?.isText() &&
          channel
            .send({
              embeds: [
                {
                  author: { name: `Chat Bridge is Offline` },
                  color: 0xF04947,
                },
              ],
            })
            .then(() => {
              process.exit()
            })
      })
      .catch(() => {
        process.exit()
      })
  }
}

/**
 * @param {import('../DiscordManager')} discord
 */
async function getWebhook(discord) {
  let channel = discord.client?.channels.cache.get(discord.app.config.discord.channel)
  if (!channel || !(channel instanceof TextChannel)) return

  let webhooks = await channel?.fetchWebhooks()
  if (webhooks.first()) {
    return webhooks.first()
  } else {
    var res = await channel.createWebhook(discord.client?.user?.username ?? 'Chat Bridge', {
      avatar: discord.client?.user?.avatarURL() ?? undefined,
    })
    return res
  }
}

module.exports = StateHandler
