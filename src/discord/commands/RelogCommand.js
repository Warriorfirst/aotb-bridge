const DiscordCommand = require('../../contracts/DiscordCommand')

class RelogCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    /** @type {string} */
    this.name = 'relog'
    /** @type {string} */
    this.description = 'Relogs the minecraft client after a given period of time'
    /** @type {import('discord.js').ApplicationCommandOptionData[]} */
    this.options = [{ name: 'time', description: 'Length of time to wait before relogging in seconds', type: 'NUMBER' }]
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  onCommand(interaction) {
    const time = interaction.options.get('time')

    if (!time) {
      return this.relogWithDelay(interaction)
    }

    const delay = Math.min(Math.max(time.value, 5), 300)

    return this.relogWithDelay(interaction, delay)
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  relogWithDelay(interaction, delay = 0) {
    this.discord.app.minecraft.stateHandler.exactDelay = delay * 1000
    this.discord.app.minecraft.bot.quit('Relogging')

    return interaction.reply({
      content: `The Minecraft account have disconnected from the server! Reconnecting in ${delay == 0 ? 5 : delay} seconds.`,
    })
  }
}

module.exports = RelogCommand
