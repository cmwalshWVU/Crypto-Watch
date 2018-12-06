import React, { Component } from 'react';
import Header from './header/Header';
import PriceHistoryTable from './bitcoinMonitor/PriceHistoryTable';
import CryptoTicker from './tickers/CryptoTicker.js';

class App extends Component {
	constructor() {
		super();

	
		this.state = {
			currentPrice: 'N/A'
		}	
	}
render() {
	return (
		<main className="App">
			<Header title="Crypto Watch" />
			<CryptoTicker />
			<PriceHistoryTable />
		</main>
		)
	}
}

export default App;
