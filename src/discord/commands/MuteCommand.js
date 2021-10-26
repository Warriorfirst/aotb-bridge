const DiscordCommand = require('../../contracts/DiscordCommand')

class MuteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    /** @type {string} */
    this.name = 'mute'
    /** @type {string} */
    this.description = 'Mutes the given user for a given amount of time'
    /** @type {import('discord.js').ApplicationCommandOptionData[]} */
    this.options = [
      { name: 'user', description: `The user to ${this.name}`, required: true, type: 'STRING' },
      { name: 'time', description: `The length of time to mute the user for`, required: true, type: 'STRING' },
    ]
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  onCommand(interaction) {
    const user = interaction.options.get('user').value
    const time = interaction.options.get('time').value

    const command = `/g mute ${user} ${time}`

    this.sendMinecraftMessage(command)

    return interaction.reply({ content: `\`${command}\` has been executed.` })
  }
}

module.exports = MuteCommand
