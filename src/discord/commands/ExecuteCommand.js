const DiscordCommand = require('../../contracts/DiscordCommand')

class ExecuteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    /** @type {string} */
    this.name = 'execute'
    /** @type {string} */
    this.description = 'Executes commands as the minecraft bot'
    /** @type {import('discord.js').ApplicationCommandOptionData[]} */
    this.options = [{ name: 'command', description: 'The command to execute.', required: true, type: 'STRING' }]
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  onCommand(interaction) {
    const command = interaction.options.get('command').value

    this.sendMinecraftMessage(`/${command}`)

    return interaction.reply({ content: `\`/${command}\` has been executed.` })
  }
}

module.exports = ExecuteCommand
