const DiscordCommand = require('../../contracts/DiscordCommand')

class DemoteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    /** @type {string} */
    this.name = 'demote'
    /** @type {string} */
    this.description = 'Demotes the given user by one guild rank'
    /** @type {import('discord.js').ApplicationCommandOptionData[]} */
    this.options = [{ name: 'user', description: `The user to ${this.name}`, required: true, type: 'STRING' }]
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  onCommand(interaction) {
    const user = interaction.options.get('user').value

    const command = `/g demote ${user}`

    this.sendMinecraftMessage(command)

    return interaction.reply({ content: `\`${command}\` has been executed.` })
  }
}

module.exports = DemoteCommand
