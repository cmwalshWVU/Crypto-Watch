function generatePrices () {
	var prices = [];

	const today = new Date();

	var day = 86400;

	for (var id = 0; id < 15; id++) {
		prices.push({
			"id":id,
			"ticker":"BTC",
			"open":2,
			"close": 2,
			"timestamp":  Math.floor(new Date(today) / 1000) - (id*day),
			"currentPrice": 1,
		})
	}
	return {"prices": prices}
}

function getTimestamp(i) {
	return Date.now() - 1000 * 60 * 60 * 24 * i;
}

module.exports = generatePrices