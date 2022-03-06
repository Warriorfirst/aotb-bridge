const fs = require('fs')

class Configuration {
  properties = {
    server: {
      host: 'localhost',
      port: 25565,
    },
    discord: {
      token: '',
      channel: '',
      commandRole: '',
      ownerId: '',
      prefix: '!',
      messageMode: 'bot',
    },
    express: {
      enabled: false,
      port: 8880,
      authorization: 'authorizationHeaderString',
    },
  }

  environmentOverrides = {
    SERVER_HOST: (/** @type {string} */ val) => (this.properties.server.host = val),
    SERVER_PORT: (/** @type {number} */ val) => (this.properties.server.port = val),
    DISCORD_TOKEN: (/** @type {string} */ val) => (this.properties.discord.token = val),
    DISCORD_CHANNEL: (/** @type {string} */ val) => (this.properties.discord.channel = val),
    DISCORD_COMMAND_ROLE: (/** @type {string} */ val) => (this.properties.discord.commandRole = val),
    DISCORD_OWNER_ID: (/** @type {string} */ val) => (this.properties.discord.ownerId = val),
    DISCORD_PREFIX: (/** @type {string} */ val) => (this.properties.discord.prefix = val),
    MESSAGE_MODE: (/** @type {string} */ val) => (this.properties.discord.messageMode = val),
    EXPRESS_ENABLED: (/** @type {boolean} */ val) => (this.properties.express.enabled = val),
    EXPRESS_PORT: (/** @type {boolean} */ val) => (this.properties.express.enabled = val),
    EXPRESS_AUTHORIZATION: (/** @type {string} */ val) => (this.properties.express.authorization = val),
  }

  constructor() {
    if (fs.existsSync('config.json')) {
      // @ts-ignore
      this.properties = require('../config.json')
    }

    for (let environment of Object.keys(process.env)) {
      // @ts-ignore
      if (this.environmentOverrides[environment]) {
        // @ts-ignore
        this.environmentOverrides[environment](process.env[environment])
      }
    }
  }

  get server() {
    return this.properties.server
  }

  get discord() {
    return this.properties.discord
  }

  get express() {
    return this.properties.express
  }
}

module.exports = Configuration
