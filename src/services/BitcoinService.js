import axios from 'axios';

const API = 'https://api.coindesk.com/v1/bpi/';

class BitcoinService {
  static getCurrentPrice = () =>
    axios
      .get(`${API}currentPrice.json`, {})
      .then((response) => response.data, (error) => error.response.status);

  static getPrices = (startDate, endDate) =>
    axios
      .get(`${API}historical/close.json?start=${startDate}&end=${endDate}`, {})
      .then((response) => response.data, (error) => error.response.status);

  
  static getRsiDataByTicker = ( ticker, interval, hourly ) =>
  	axios
  		.get('https://min-api.cryptocompare.com/data/histominute?fsym='+ticker+'&tsym=USD&limit=13&aggregate='+interval+'&e=CCCAGG', {})
  		.then((response) => response.data, (error) => error.response.status);


  static getRsiDataByTime = ( ticker, interval, hourly ) =>
    axios
      .get('https://min-api.cryptocompare.com/data/'+hourly+'?fsym='+ticker+'&tsym=USD&limit=13&aggregate='+interval+'&e=CCCAGG', {})
      .then((response) => response.data, (error) => error.response.status);

  static calculateRsi (prices) {
    let gains = 0;
    let loses = 0;
    let RSI = 0;
    if (prices != null) {
      for (let date in prices) {
        let change = prices[date].close - prices[date].open;
        if (change > 0) {
          gains += change;
        }
        else if (change < 0) {
          loses += Math.abs(change);
        }
      }
      let rs = (gains/14)/(loses/14);
      RSI = 100 - (100/( 1 + rs));
      return RSI.toFixed(2);
    }
  } 

}
	

export default BitcoinService;
