const Configuration = require('./Configuration')
const DiscordManager = require('./discord/DiscordManager')
const MinecraftManager = require('./minecraft/MinecraftManager')
const ExpressManager = require('./express/ExpressManager')
const Logger = require('./Logger')

class Application {
  log = new Logger()
  config = new Configuration()

  async register() {
    this.discord = new DiscordManager(this)
    this.minecraft = new MinecraftManager(this)
    this.express = new ExpressManager(this)

    this.discord.setBridge(this.minecraft)
    this.minecraft.setBridge(this.discord)
  }

  async connect() {
    await this.discord?.connect()
    await this.minecraft?.connect()
    await this.express?.initialize()
  }
}

module.exports = new Application()
