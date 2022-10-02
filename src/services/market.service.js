const { Market } = require("../models")

class MarketService{
    constructor() { }
    
    async getMarkets(filters) {
        const markets = await Market.find(filters)
        console.log(markets)
    }
}

module.exports = MarketService