const Strategy = require('./strategy')

const tulind = require('tulind')

class SimpleMACD extends Strategy {
  async run({sticks, time}) {
    const prices = sticks.map(stick => stick.average())

    const shortPeriod = 12
    const longPeriod = 26
    const signalPeriod = 9
    const indicator = tulind.indicators.macd.indicator

    const result = await indicator([prices], [shortPeriod, longPeriod, signalPeriod])

    const histogram = result[2]
    const singal = result[1]
    const macd = result[0]

    const length = histogram.length
    if(length < 2) {return}

    const penultimate = histogram[length - 2]
    const last = histogram[length - 1]

    const boundary = 0.5

    const wasAbove = penultimate > boundary
    const wasBelow = penultimate < -boundary
    const isAbove = last > boundary
    const isBelow = last < -boundary

    const open = this.openPositions()

    const price = sticks[sticks.length - 1].close

    if(open.length == 0) {
      if(wasAbove && isBelow) {
        this.onBuySignal({price, time})
      }
    } else {
      open.forEach(p => {
        if(isAbove && wasBelow) {
          if(p.enter.price * 1.01 < price) {
            this.onSellSignal({price, time, size: p.enter.size, position:p})
          }
        } 
        // else {
        //   if(p.enter.price * 0.975 > price) {
        //     this.onSellSignal({price, time, size: p.enter.size, position: p})
        //   }
        // }
      })
    }
  }
}


module.exports = SimpleMACD