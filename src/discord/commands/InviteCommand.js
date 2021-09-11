const DiscordCommand = require('../../contracts/DiscordCommand')

class InviteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    /** @type {string} */
    this.name = 'invite'
    /** @type {string} */
    this.description = 'Invites the given user to the guild'
    /** @type {import('discord.js').ApplicationCommandOptionData[]} */
    this.options = [{ name: 'user', description: `The user to ${this.name}`, required: true, type: 'STRING' }]
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  onCommand(interaction) {
    const user = interaction.options.get('user').value

    const command = `/g invite ${user}`

    this.sendMinecraftMessage(command)

    return interaction.reply({ content: `\`${command}\` has been executed.`, ephemeral: true })
  }
}

module.exports = InviteCommand
