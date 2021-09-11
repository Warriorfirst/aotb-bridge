const DiscordCommand = require('../../contracts/DiscordCommand')

class PromoteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    /** @type {string} */
    this.name = 'promote'
    /** @type {string} */
    this.description = 'Promotes the given user by one guild rank'
    /** @type {import('discord.js').ApplicationCommandOptionData[]} */
    this.options = [{ name: 'user', description: `The user to ${this.name}`, required: true, type: 'STRING' }]
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  onCommand(interaction) {
    const user = interaction.options.get('user').value

    const command = `/g promote ${user}`

    this.sendMinecraftMessage(command)

    return interaction.reply({ content: `\`${command}\` has been executed.`, ephemeral: true })
  }
}

module.exports = PromoteCommand
