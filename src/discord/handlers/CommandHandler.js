const fs = require('fs')
const { Collection } = require('discord.js')

class CommandHandler {
  /**
   * @param {import('../DiscordManager')} discord
   */
  constructor(discord) {
    this.discord = discord

    this.prefix = discord.app.config.discord.prefix

    this.commands = new Collection()

    fs.readdirSync('./src/discord/commands')
      .filter(file => file.endsWith('.js'))
      .forEach(file => {
        const command = new (require(`../commands/${file}`))(discord)
        this.commands.set(command.name, command)
      })
  }

  /**
   * @param {import('discord.js').Message} message
   */
  handle(message) {
    if (!message.content.startsWith(this.prefix)) {
      return false
    }

    let args = message.content.slice(this.prefix.length).trim().split(/ +/)
    let commandName = args.shift()?.toLowerCase()

    /** @type {import('../../contracts/DiscordCommand')} */
    let command = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) {
      return false
    }

    switch (command.permission) {
      case 'everyone':
        break

      case 'owner':
        if (!this.isOwner(message.author)) {
          return message.channel
            .send({
              embeds: [
                {
                  description: [`You don't have permission to do that.`, `Required user: <@!${this.discord.app.config.discord.ownerId}>`].join('\n'),
                  color: 0xdc143c,
                },
              ],
            })
            .catch(this.discord.app.log.error)
        }

      case 'staff':
      default:
        if (!this.isCommander(message.member)) {
          return message.channel
            .send({
              embeds: [
                {
                  description: [`You don't have permission to do that.`, `Required role: <@&${this.discord.app.config.discord.commandRole}>`].join('\n'),
                  color: 0xdc143c,
                },
              ],
            })
            .catch(this.discord.app.log.error)
        }
    }

    this.discord.app.log.discord(`[${command.name}] ${message.content}`)
    command.onCommand(message, args)

    return true
  }

  /**
   * @param {import('discord.js').GuildMember?} member
   */
  isCommander(member) {
    return member?.roles.cache.find((/** @type {{ id: any; }} */ r) => r.id == this.discord.app.config.discord.commandRole)
  }

  /**
   * @param {import('discord.js').User} user
   */
  isOwner(user) {
    return user.id == this.discord.app.config.discord.ownerId
  }
}

module.exports = CommandHandler
