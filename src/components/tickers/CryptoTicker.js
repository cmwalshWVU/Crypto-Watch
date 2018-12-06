import React, { Component } from 'react';
import './Cryptocurrency.css';
import Cryptocurrency from './Cryptocurrency';
import axios from 'axios';
import fire from './../FireBaseConfig.js';
import moment from 'moment';

class Tickers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentBtcPrice: "N/A",
			data: [
				{
					id: "bitcoin",
					name: "Bitcoin",
					symbol: "BTC",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "ethereum",
					name: "Ethereum",
					symbol: "ETH",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",
				},
				{
					id: "litecoin",
					name: "Litecoin",
					symbol: "LTC",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",				
				},
				{
					id: "ripple",
					name: "Ripple",
					symbol: "XRP",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",				
				},
				{
					id: "neo",
					name: "NEO",
					symbol: "NEO",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_2hh: "0",
					percent_change_7d: "0",				
				},
				{
					id: "bitcoin-cash",
					name: "Bitcoin Cash",
					symbol: "BCH",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",				
				},
				{
					id: "eos",
					name: "EOS",
					symbol: "EOS",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",				
				},
				{
					id: "stellar",
					name: "Stellar",
					symbol: "XLM",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",				
				},
				{
					id: "tether",
					name: "Tether",
					symbol: "USDT",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",				
				},
				{
					id: "cardano",
					name: "Cardano",
					symbol: "ADA",
					price_usd: "1",
					percent_change_1h: "0",
					percent_change_24h: "0",
					percent_change_7d: "0",				
				}
			],
			updateHistory: true
		};
	}

	componentDidMount() {
		this.fetchCryptocurrenncyData();
		this.historyInterval = setInterval(() => this.setState({
			updateHistory: true
		}), 5 * 60 * 1000);
		this.interval = setInterval(() => this.fetchCryptocurrenncyData(), 30 * 1000);
	}

	fetchCryptocurrenncyData() {
		axios.get("https://api.coinmarketcap.com/v1/ticker/?limit=10")
			.then(response => {
				var wanted = ["bitcoin", "ethereum", "litecoin", "ripple", "neo", "bitcoin-cash", "eos", "stellar"];
                // var result = response.data.filter(currency => wanted.includes(currency.id));
                var result = response.data;
                this.setState({ data: result});
                var btc = ["bitcoin"];
                let currentPrice = response.data.filter(currency => btc.includes(currency.id));
                this.setState({ currentBtcPrice: currentPrice.price_usd});
                this.upsertCurrentPrices();
			})
			.catch(err => console.log(err));
	}

	upsertCurrentPrices() {
		let db = fire.firestore();
 		db.settings({
    		timestampsInSnapshots: true
  		});
	    if (this.state.data != null) {
		    for (let ticker in this.state.data) {
			    const priceref = db.collection('prices').doc(this.state.data[ticker].symbol).set({
			      ticker: this.state.data[ticker].symbol,
			      date: Date.now().toString(),
			      price: this.state.data[ticker].price_usd
			    });  	
		    } 
	  	}
	  	if (this.state.updateHistory) {
	  		for (let ticker in this.state.data) {
			    const priceref = db.collection('prices').doc(this.state.data[ticker].symbol).collection('priceHistory').doc(Date.now().toString()).set({
			      ticker: this.state.data[ticker].symbol,
			      date: Date.now().toString(),
			      price: this.state.data[ticker].price_usd
			    });  	
		    } 
			this.setState({
				updateHistory: false
			});	  
		} 
	}

	lastUpdated() {
	    return moment().format("llll");
	}

	render() {
		
		var tickers = this.state.data.map((currency) => 
			<Cryptocurrency data={currency} key={currency.id} />
		);

		var currentPrice = parseFloat( this.state.data[0].price_usd).toFixed(2);
		return (
			<div>
				<h1>Current BTC price is: ${(currentPrice)}</h1>
				<small className="last-updated">Last Updated: {this.lastUpdated()}</small>
				<div className="tickers-container">
					<ul className="tickers">{tickers}</ul>
					<p> Information updated every minute from the Cryptocompare API </p>
				</div>
			</div>

		);
	}
}

export default Tickers;