const Simple = require('./simple')
const MACD = require('./simpleMACD')

exports.create = function(type, data) {
  switch (type) {
    case 'macd':
      return new MACD(data)
      break;
    case 'simple':
      return new Simple(data)
      break;
    default:
      return new MACD(data)
      break;
  }

}