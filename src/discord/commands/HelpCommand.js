const DiscordCommand = require('../../contracts/DiscordCommand')

const { version } = require('../../../package.json')

class HelpCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    /** @type {string} */
    this.name = 'help'
    /** @type {string} */
    this.description = 'Shows the help menu'
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  onCommand(interaction) {
    let discordCommands = []
    let minecraftCommands = []

    this.discord.interactionHandler.commands.forEach(command => {
      discordCommands.push(`\`${command.name}\`: ${command.description}`)
    })

    this.discord.app.minecraft.chatHandler.command.commands.forEach(command => {
      minecraftCommands.push(`\`${command.name}\`: ${command.description}`)
    })

    return interaction.reply({
      embeds: [
        {
          title: 'Help',
          description: ['`< >` = Required arguments', '`[ ]` = Optional arguments'].join('\n'),
          fields: [
            {
              name: 'Discord Commands',
              value: discordCommands.join('\n'),
            },
            {
              name: 'Minecraft Commands',
              value: minecraftCommands.join('\n'),
            },
            {
              name: `Info`,
              value: [
                'Prefix: `/`',
                `Guild Channel: <#${this.discord.app.config.discord.guildChannel}>`,
                `Officer Channel: <#${this.discord.app.config.discord.officerChannel}>`,
                `Command Role: <@&${this.discord.app.config.discord.commandRole}>`,
                `Version: \`${version}\``,
              ].join('\n'),
            },
          ],
          color: interaction.guild.me.displayHexColor,
          footer: {
            text: 'Made by Senither and neyoa ❤',
          },
          timestamp: new Date(),
        },
      ],
    })
  }
}

module.exports = HelpCommand
