const Candlestick = require('../models/candlestick')
const Runner = require('../runner')
const randomstring = require('randomstring')
const colors = require('colors/safe')

class Backtester extends Runner {

  async start() {
    try {
      const history = await this.historical.getData()
    
      await Promise.all(history.map((stick, index) => {
        const sticks = history.slice(0, index + 1)
        return this.strategy.run({sticks, time: stick.startTime})
      }))

      this.printPositions()
      this.printProfits()

    } catch (error) {
      console.log(error);
    }
  }

  async onBuySignal({price, time}) {
    const id = randomstring.generate(20)
    this.strategy.positionOpened({price, time, size: 1.0, id})
  }


  async onSellSignal({price, size, time, position}) {
    this.strategy.positionClosed({price, time, size, id: position.id})
  }

}

module.exports = Backtester