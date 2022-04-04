const fs = require('fs')
const { Collection } = require('discord.js')

class CommandHandler {
  /**
   * @param {import('./MinecraftManager')} minecraft
   */
  constructor(minecraft) {
    this.minecraft = minecraft

    this.commands = new Collection()

    let commandFiles = fs.readdirSync('./src/minecraft/commands').filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = new (require(`./commands/${file}`))(minecraft)

      this.commands.set(command.name, command)
    }

    if (fs.existsSync('./src/minecraft/commands/extras')) {
      let extraCommandFiles = fs.readdirSync('./src/minecraft/commands/extras').filter(file => file.endsWith('.js'))
      for (const file of extraCommandFiles) {
        const command = new (require(`./commands/extras/${file}`))(minecraft)

        this.commands.set(command.name, command)
      }
    }
  }

  /**
   * @param {string} player
   * @param {string} message
   */
  handle(player, message) {
    let args = message.split(/ +/)
    let commandName = args.shift()?.toLowerCase()

    if (!commandName) return

    let command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return

    this.minecraft.app.log.minecraft(`${player} - [${command.name}] ${message}`)
    command.onCommand(player, message)
  }
}

module.exports = CommandHandler
