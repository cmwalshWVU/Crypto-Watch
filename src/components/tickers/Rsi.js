import React, { Component } from 'react';
import fire from './../FireBaseConfig.js';
import firebase from 'firebase';
import BitcoinService from '../../services/BitcoinService';

class Rsi extends Component {

	constructor(props) {
		super(props);
		this.state = {
			interval: 30,
			prices: null,
			rsi: null,
			numberOfObjects: 13
		};
		this.db = fire.firestore();
		this.db.settings({
			timestampsInSnapshots: true
		});
	    this._isMounted = false
	}

	componentDidMount() {
		this._isMounted = true;

	    this.getPrices();
	    // this.interval = setInterval(() => this.getPrices(),  6 * 1000);
	}

	componentWillUnmount() {
	   this._isMounted = false;
	}

	getPrices = async () => {
	    try {
	      const prices = await BitcoinService.getRsiDataByTicker(
	        this.props.data[0],
	        this.props.data[1],
	        this.props.data[2]
	      );
	      this.setState({ isLoading: false });
	      this.setState({ prices: prices.Data });
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

  	upsertData( token, currentRsi, avgGains, avgLoses ) {
		var milliseconds = (new Date).getTime();
		this.db.settings({ timestampsInSnapshots: true });
		const priceref = this.db.collection('RSI').doc(token).set({
			timeStamp: milliseconds,
       		rsi: currentRsi,
       		gains: avgGains,
       		loses: avgLoses
       	});  	 
	}

	render() {
	  	return (
	  		<div>
			<p className="current-rsi"> RSI: {this.state.rsi}</p>				
			</div>
		);
	}
}
export default Rsi;
