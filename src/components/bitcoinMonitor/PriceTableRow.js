import React, { Component } from 'react';

class PriceTableRow extends Component {

	render() {
		var {
			close,
			high,
			low,
			open,
			time,
			volumefrom,
			volumeto,
		} = this.props.data;
		let d = new Date(time * 1000);

		return (
			<tr className={time} key={time}>
			    <td>{d.toLocaleString()}</td>
			    <td>${open}</td>
			    <td>${close}</td>
			    <td>${(close - open).toFixed(2)}</td>
			    <td>{(close - open).toFixed(2)/open}%</td>
			</tr>
		);
	}
}

export default PriceTableRow;