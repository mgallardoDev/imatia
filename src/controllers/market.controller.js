const { MarketService } = require("../services")


const marketService = new MarketService()

const getMarkets = async (req, res) => {
    const markets = marketService.getMarkets()
}

module.exports = { getMarkets }

