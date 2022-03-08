/**
 * @typedef {import("../discord/DiscordManager") | import("../minecraft/MinecraftManager")} bridge
 */

class CommunicationBridge {
  /**
   * @type {bridge | null} bridge
   */
  bridge = null

  getBridge() {
    return this.bridge
  }

  /**
   * @param {bridge} bridge
   */
  setBridge(bridge) {
    this.bridge = bridge
  }

  /**
   * @param {any} event
   */
  broadcastMessage(event) {
    return this.bridge?.onBroadcast(event)
  }

  /**
   * @param {any} event
   */
  broadcastPlayerToggle(event) {
    return this.bridge?.onPlayerToggle(event)
  }

  /**
   * @param {{message: string; color: number; destination: 'guild' | 'officer' | 'both'}} event
   */
  broadcastCleanEmbed(event) {
    return this.bridge?.onBroadcastCleanEmbed(event)
  }

  /**
   * @param {{message: string; title: string; icon: string; color: number; destination: 'guild' | 'officer' | 'both'}} event
   */
  broadcastHeadedEmbed(event) {
    return this.bridge?.onBroadcastHeadedEmbed(event)
  }

  connect() {
    throw new Error('Communication bridge connection is not implemented yet!')
  }

  /**
   * @param {any} event
   */
  onBroadcast(event) {
    throw new Error('Communication bridge broadcast handling is not implemented yet!')
  }

  /**
   * @param {any} event
   */
  onPlayerToggle(event) {
    throw new Error('Communication bridge player toggle handling is not implemented yet!')
  }

  /**
   * @param {any} event
   */
  onBroadcastCleanEmbed(event) {
    throw new Error('Communication bridge clean embed broadcast handling is not implemented yet!')
  }

  /**
   * @param {any} event
   */
  onBroadcastHeadedEmbed(event) {
    throw new Error('Communication bridge headed embed broadcast handling is not implemented yet!')
  }
}

module.exports = CommunicationBridge
