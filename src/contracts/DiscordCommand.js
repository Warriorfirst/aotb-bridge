class DiscordCommand {
  /**@type {string} */
  name

  /**@type {string} */
  description

  /** @type {import('discord.js').ApplicationCommandOptionData[]} */
  options = []

  /** @type {import('discord.js').ApplicationCommandType} */
  type = 'CHAT_INPUT'

  constructor(discord) {
    this.discord = discord
  }

  getArgs(message) {
    let args = message.content.split(' ')

    args.shift()

    return args
  }

  sendMinecraftMessage(message) {
    if (this.discord.app.minecraft.bot.player !== undefined) {
      this.discord.app.minecraft.bot.chat(message)
    }
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  rejectNoPermission(interaction) {
    interaction.reply({
      embeds: [
        {
          description: `You don't have permission to do that.`,
          color: 'DC143C',
        },
      ],
      ephemeral: true,
    })
  }

  onCommand(message) {
    throw new Error('Command onCommand method is not implemented yet!')
  }
}

module.exports = DiscordCommand
