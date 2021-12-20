// requires
const program = require('commander')
const CoinbasePro = require('coinbase-pro')
const config = require('./configuration')
const HistoricalService = require('./src/historical')
const Backtester = require('./src/backtester')
const Trader = require('./src/trader')
// dates
const now = new Date()
const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1e3))
program.version('1.0.0')
      .option('-i, --interval [interval]', 'Interval in seconds for candle stick', parseInt)
      .option('-p, --product [product]', 'Product Identifier', 'BTC-USD')
      .option('-s, --start [start]', 'Start time in unix seconds', toDate, yesterday)
      .option('-e, --end [end]', 'End time in unix seconds', toDate, now)
      .option('-t, --strategy [strategy]', 'Strategy type')
      .option('-r, --type [type]', 'Run Type')
      .option('-f, --funds [funds]', 'Amount of money to use', parseInt)
      .option('-l, --live', 'Run Live')
program.parse(process.argv);


function toDate(val) {
  return new Date(val * 1e3)
}

const main = async function() {
  const {interval, product, start, end, strategy, live, type, funds} = program.opts()
  
  if(type == 'trader') {
    const trader = new Trader({start, end, product, interval, strategyType: strategy, live, funds})
    await trader.start()
  } else {
    const tester = new Backtester({start, end, product, interval, strategyType: strategy})
    await tester.start()
  }
}

main()