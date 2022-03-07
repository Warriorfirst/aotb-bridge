const chalk = require('chalk').default

class Logger {
  /**
   * @param {string} message
   */
  discord(message) {
    return console.log(chalk.bgMagenta.black(`[${this.getCurrentTime()}] Discord >`) + ' ' + chalk.magenta(message))
  }

  /**
   * @param {string} message
   */
  minecraft(message) {
    return console.log(chalk.bgGreenBright.black(`[${this.getCurrentTime()}] Minecraft >`) + ' ' + chalk.greenBright(message))
  }

  /**
   * @param {string} message
   */
  express(message) {
    return console.log(chalk.bgCyan.black(`[${this.getCurrentTime()}] Express >`) + ' ' + chalk.cyan(message))
  }

  /**
   * @param {string} message
   */
  warn(message) {
    return console.log(chalk.bgYellow.black(`[${this.getCurrentTime()}] Warning >`) + ' ' + chalk.yellow(message))
  }

  /**
   * @param {string} message
   */
  error(message) {
    return console.log(chalk.bgRedBright.black(`[${this.getCurrentTime()}] Error >`) + ' ' + chalk.redBright(message))
  }

  /**
   * @param {string} message
   * @param {string} location
   */
  broadcast(message, location) {
    return console.log(chalk.inverse(`[${this.getCurrentTime()}] ${location} Broadcast >`) + ' ' + message)
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  }
}

module.exports = Logger
