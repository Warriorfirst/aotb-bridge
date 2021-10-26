const fs = require('fs')
const { Collection } = require('discord.js')

class InteractionHandler {
  commands = new Collection()

  constructor(discord) {
    this.discord = discord
  }

  /** @param {import('discord.js').CommandInteraction} interaction */
  onInteraction(interaction) {
    if (!interaction.isCommand()) return

    const commandName = interaction.commandName

    const command = this.commands.get(commandName)

    if (!command) return

    switch (command.name) {
      case 'help':
        break

      case 'execute':
        if (!this.isOwner(interaction.member)) {
          return command.rejectNoPermission(interaction)
        }
        break

      default:
        if (!this.isCommander(interaction.member)) {
          return command.rejectNoPermission(interaction)
        }
        break
    }

    this.discord.app.log.discord(`[${command.name}] run by ${interaction.member.nickname}`)
    command.onCommand(interaction)
  }

  async registerCommand(command) {
    const data = this.buildData(command)

    const guild = this.discord.client.guilds.cache.find(guild => guild.channels.cache.has(this.discord.app.config.discord.guildChannel))

    return await guild.commands.create(data).catch(e => this.discord.app.log.error(e))
  }

  /** @return {import('discord.js').ApplicationCommandData} */
  buildData(command) {
    return {
      name: command.name,
      description: command.description,
      options: command.options,
      type: command.type,
    }
  }

  async loadCommands() {
    return Promise.all(
      fs.readdirSync(`./src/discord/commands`).map(file => {
        const command = new (require(`../commands/${file}`))(this.discord)

        this.commands.set(command.name, command)
        return this.registerCommand(command)
      })
    )
  }

  isCommander(member) {
    return member.roles.cache.find(r => r.id == this.discord.app.config.discord.commandRole)
  }

  isOwner(member) {
    return member.id == this.discord.app.config.discord.ownerId
  }
}

module.exports = InteractionHandler
