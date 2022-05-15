const chalk = require('chalk')

class Logger {
  /**
   * @param {string} message
   */
  discord(message) {
    return console.log(chalk.bgMagenta.black(`[${Logger.getCurrentTime()}] Discord >`) + ' ' + chalk.magenta(message))
  }

  /**
   * @param {string} message
   */
  minecraft(message) {
    return console.log(chalk.bgGreenBright.black(`[${Logger.getCurrentTime()}] Minecraft >`) + ' ' + chalk.greenBright(message))
  }

  /**
   * @param {string} message
   */
  express(message) {
    return console.log(chalk.bgCyan.black(`[${Logger.getCurrentTime()}] Express >`) + ' ' + chalk.cyan(message))
  }

  /**
   * @param {string} message
   */
  warn(message) {
    return console.log(chalk.bgYellow.black(`[${Logger.getCurrentTime()}] Warning >`) + ' ' + chalk.yellow(message))
  }

  /**
   * @param {string} message
   */
  error(message) {
    return console.log(chalk.bgRedBright.black(`[${Logger.getCurrentTime()}] Error >`) + ' ' + chalk.redBright(message))
  }

  /**
   * @param {string} message
   * @param {string} location
   */
  broadcast(message, location) {
    return console.log(chalk.inverse(`[${Logger.getCurrentTime()}] ${location} Broadcast >`) + ' ' + message)
  }

  static getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  }
}

module.exports = Logger
