const DiscordCommand = require('../../contracts/DiscordCommand')

const { version } = require('../../../package.json')

class HelpCommand extends DiscordCommand {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    super(discord)

    this.name = 'help'
    this.aliases = ['h', 'info']
    this.description = 'Shows this help menu'

    /** @type {'everyone' | 'owner' | 'staff'} */
    this.permission = 'everyone'
  }

  /**
   * @param {import('discord.js').Message} message
   * @param {string[]} args
   */
  onCommand(message, args) {
    /** @type {string[]} */
    const discordCommands = []
    /** @type {string[]} */
    const minecraftCommands = []

    this.discord.messageHandler.command.commands.forEach(command => {
      discordCommands.push(`\`${command.name}\`: ${command.description}`)
    })

    this.discord.app.minecraft?.chatHandler.command.commands.forEach(command => {
      minecraftCommands.push(`\`${command.name}\`: ${command.description}`)
    })

    message
      .reply({
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
                  `Prefix: \`${this.discord.app.config.discord.prefix}\``,
                  `Guild Channel: <#${this.discord.app.config.discord.channels.guild}>`,
                  `Officer Channel: <#${this.discord.app.config.discord.channels.officer}>`,
                  `Command Role: <@&${this.discord.app.config.discord.commandRole}>`,
                  `Version: \`${version}\``,
                ].join('\n'),
              },
            ],
            color: message.guild?.members.me?.displayColor,
            footer: {
              text: 'Made by Senither and neyoa ❤',
            },
            timestamp: new Date().toISOString(),
          },
        ],
        allowedMentions: { parse: [] },
      })
      .catch(this.discord.app.log.error)
  }
}

module.exports = HelpCommand
