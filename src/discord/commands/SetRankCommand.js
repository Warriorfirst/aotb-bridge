const DiscordCommand = require('../../contracts/DiscordCommand')

class SetRankCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    /** @type {string} */
    this.name = 'setrank'
    /** @type {string} */
    this.description = `Sets the user's guild rank to the given rank name`
    /** @type {import('discord.js').ApplicationCommandOptionData[]} */
    this.options = [
      { name: 'user', description: `The user to ${this.name}`, required: true, type: 'STRING' },
      { name: 'rank', description: 'The rank to set the user to', required: true, type: 'STRING' },
    ]
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  onCommand(interaction) {
    const user = interaction.options.get('user').value
    const rank = interaction.options.get('rank').value

    const command = `/g setrank ${user} ${rank}`

    this.sendMinecraftMessage(command)

    return interaction.reply({ content: `\`${command}\` has been executed.` })
  }
}

module.exports = SetRankCommand
