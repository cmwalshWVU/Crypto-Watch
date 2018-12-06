import React, { Component } from 'react';
import './Cryptocurrency.css';
import Rsi from './Rsi';

class Cryptocurrency extends Component {

	render() {
		var {
			id,
			name,
			symbol,
			price_usd,
			percent_change_1h,
			percent_change_24h,
			percent_change_7d,
			rank,
		} = this.props.data;
		let props = [symbol, 30, false];
		var rsiTicker = <Rsi data={props}  />;

		return (
			<li className={"cryptocurrency " + (percent_change_1h.indexOf("-") === -1? "positive" : "negative")}>
				<div className="wrapper">
					<p className="cryptocurrency-rank"> Rank: {rank}</p>
					<p className="cryptocurrency-name">{name} ({symbol})</p>
					<p className="price">${ (+price_usd).toFixed(2) }</p>
					<p>{percent_change_1h}% 1hr</p>
					<p>{percent_change_24h}% 24hrs</p>
					<p>{percent_change_7d}% 7days</p>
					<div className="rsiTickers">{rsiTicker}</div>
				</div>	
			</li>
		);
	}
}

export default Cryptocurrency;