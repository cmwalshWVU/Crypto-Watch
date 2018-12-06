import React, { Component } from 'react';
import _ from 'lodash';
import fire from './../FireBaseConfig.js';
import moment from 'moment';
import './PriceHistory.css';
import PriceTableRow from './PriceTableRow'
import BitcoinService from '../../services/BitcoinService';

class PriceHistoryClass extends Component {

	constructor(props) {
		super(props);
		this.state = {
			prices: null,
			isLoading: true,
			error: null,
			tickerDropdownOpen: false,		
			dropdownOpen: false,		
			interval: 30,
			isHourly: false,
			symbol: 'BTC',
			rsi: null
		};
	}

	componentDidMount() {
	    this.setState({ isLoading: true });
	    this.getPricesByTicker('BTC');
	}

	getPricesbyTime = async (interval, hourly) => {
		let type = "histominute";
		let ticker = this.state.symbol;
	    if( hourly ===  true) {
	    	type = "histohour";
    	}
	    try {
			const prices = await BitcoinService.getRsiDataByTime(
				ticker,
				interval,
				type
			);
			this.setState({ isLoading: false });
			this.setState({ prices: prices.Data });
			this.setState({ interval: interval });
	      	this.setState({ isHourly: hourly });
	      	this.calculateRsi(prices.Data);
	    } catch (error) {
			this.setState({ isLoading: false });
			this.setState({ error: error.message });
	    }
	};

	getPricesByTicker = async (ticker) => {
		let i = this.state.interval;
	    let type = "histominute";
	    if( this.state.isHourly ===  true) {
	    	type = "histohour";
    	}
	    try {
			const prices = await BitcoinService.getRsiDataByTicker(
				ticker,
				i,
				type
			);
			this.setState({ isLoading: false });
			this.setState({ prices: prices.Data });
			this.setState({ symbol: ticker });		
	      	this.calculateRsi(prices.Data);
	    } catch (error) {
			this.setState({ isLoading: false });
			this.setState({ error: error.message });
	    }
	};

	calculateRsi( prices ) {
		if (this.state.prices != null) {
			const RSI = BitcoinService.calculateRsi(
				prices
			);
			this.setState({ rsi: RSI });
			// this.upsertData(this.props.data[0], RSI, gains/14, loses/14);

		}
	}
	
	upsertData() {
	  	let db = fire.firestore();
		db.settings({
		  timestampsInSnapshots: true
		});
	  	if (this.state.prices != null) {
		    for (let date in this.state.prices) {
		      db.settings({ timestampsInSnapshots: true });
		      const priceref = db.collection('priceHistory').doc(date).set({
		        date: date,
		        price: this.state.prices[date]
		      });  
		    }
		}	 
	}

	lastUpdated() {
	    return moment().format("llll");
	}

	render() {
		
		if (this.state.isLoading || (this.state.prices === null || this.state.prices.length !== 14)) {
    		return <div>Loading ...</div>;
  		}
  		else if (this.state.error !== null) {
			return <div>Error: {this.state.error}! Please try again.</div>;
		}
  		else {
  			let tableRows = this.state.prices.map((key) => 
				<PriceTableRow data={key} />	
			);
		  	return (
			    <div>
			    	<div className="current-rsi"> RSI: {this.state.rsi}</div>
				    <small className="last-updated">Last Updated: {this.lastUpdated()}</small>
				    <br />	
				    <div class="dropdown" >
						<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							{this.state.symbol}
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenu2">
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesByTicker('BTC')}}>BTC</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesByTicker('XRP')}}>XRP</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesByTicker('ETH')}}>ETH</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesByTicker('LTC')}}>LTC</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesByTicker('NEO')}}>NEO</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesByTicker('ADA')}}>ADA</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesByTicker('BCH')}}>BCH</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesByTicker('XLM')}}>XLM</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesByTicker('EOS')}}>EOS</button>
					  	</div>
					</div>
									
	          		<div class="dropdown" >
						<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							{this.state.interval} {this.state.isHourly === true? 'hr' : 'min'}
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenu2">
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesbyTime(1, false)}}>1 min</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesbyTime(5, false)}}>5 min</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesbyTime(15, false)}}>15 min</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesbyTime(30, false)}}>30 min</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesbyTime(1, true)}}>1 hr</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesbyTime(2, true)}}>2 hr</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesbyTime(4, true)}}>4 hr</button>
						    <button class="dropdown-item" type="button" onClick={() => { this.getPricesbyTime(24, true)}}>1 day</button>
						    <input class="" type="symbol" placeholder="Custom Input"></input>
						    <button type="submit"><i class="icon ion-android-arrow-forward"></i></button>
					  	</div>
					</div>

			      	<table className="table">
				        <thead>
				          	<tr>
					            <th className="text-uppercase text-center">Date</th>
					            <th className="text-uppercase text-center">Open Price</th>
					            <th className="text-uppercase text-center">Close Price</th>
					            <th className="text-uppercase text-center">$ Change</th>
					            <th className="text-uppercase text-center">% Change</th>
				          	</tr>
				        </thead>
				        <tbody className="table-body">
							{tableRows}
				        </tbody>
				    </table>
		    	</div>
			);
		}
	}
}

export default PriceHistoryClass;