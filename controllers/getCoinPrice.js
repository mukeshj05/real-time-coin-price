const { default: axios } = require("axios")
const { getIO } = require("../socket")

const getCoinPrice = async(req, res, next) => {
    let coinPriceOutput

    try {
        const binanceRes = await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","ENJUSDT","GRTUSDT"]')

        if (!!binanceRes && !!binanceRes.data && binanceRes.data.length > 0) {
            const coinPriceObject = {}

            binanceRes.data.forEach(el => {
                if (!coinPriceObject[el.symbol]) {
                    coinPriceObject[el.symbol] = el
                }
            })

            coinPriceOutput = { action: 'fetch', message: `Coin price fetched at ${new Date}`, data: coinPriceObject }

            const io = getIO()
    
            if (io) {
                setInterval(() => {
                    io.emit('coin-price', coinPriceOutput)
                }, 5000)
            }
        } else {
            coinPriceOutput = { action: 'fetch', message: 'No data found', data: null }
        }

        return res.status(200).json({
            success: coinPriceOutput.data ? true : false,
            message: coinPriceOutput.message,
            data: coinPriceOutput
        })
    } catch (err) {
        next (err)
    }
}

module.exports = getCoinPrice