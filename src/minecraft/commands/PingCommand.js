const MinecraftCommand = require('../../contracts/MinecraftCommand')

class PingCommand extends MinecraftCommand {
  /**
   * @param {import('../MinecraftManager')} minecraft
   */
  constructor(minecraft) {
    super(minecraft)

    this.name = 'ping'
    this.aliases = []
    this.description = 'Replies with `Pong!` to the user'
  }

  /**
   * @param {string} username
   * @param {string} message
   */
  onCommand(username, message) {
    this.reply(username, 'Pong!')
  }
}

module.exports = PingCommand
