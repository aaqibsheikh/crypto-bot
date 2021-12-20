const CoinbasePro = require('coinbase-pro')
const config = require('../../configuration')

const key = config.get('GDAX_API_KEY')
const secret = config.get('GDAX_API_SECRET')
const passphrase = config.get('GDAX_API_PASSPHRASE')
const waUrl = config.get('GDAX_WS_URL')

class Feed {
  constructor({ product, onUpdate, onError }) {
    this.product = product
    this.onUpdate = onUpdate
    this.onError = onError
    this.running = false
  }

  async start() {
    this.running = true
    this.client = new CoinbasePro.WebsocketClient(
      [this.product],
      waUrl,
      { key, secret, passphrase },
      { channels: ['user', 'heartbeat'] },
    )

    this.client.on('message', (data) => {
      if (data.type === 'heartbeat') {
        return
      }
      this.onUpdate(data)
    })

    this.client.on('error', (err) => {
      this.onError(err)
      this.client.connect()
    })

    this.client.on('close', () => {
      if (this.running) {
        this.client.connect()
      }
    })
  }

  async stop() {
    this.running = false
    this.client.close()
  }
}

module.exports = exports = Feed
