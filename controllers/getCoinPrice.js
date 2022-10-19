const { default: axios } = require("axios")
const { getIO } = require("../socket")

let intervelId

const getCoinPrice = async(req, res, next) => {
    // let coinPriceOutput

    try {
        const binanceData = async() => {
            try {
                const binanceRes = await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","ENJUSDT","GRTUSDT"]')
        
                if (!!binanceRes && !!binanceRes.data && binanceRes.data.length > 0) {
                    const coinPriceObject = {}
        
                    binanceRes.data.forEach(el => {
                        if (!coinPriceObject[el.symbol]) {
                            coinPriceObject[el.symbol] = el
                        }
                    })
        
                    const coinPriceOutput = { action: 'fetch', message: `Coin price fetched at ${new Date}`, data: coinPriceObject }
                    return coinPriceOutput
                } else {
                    const coinPriceOutput = { action: 'fetch', message: 'No data found', data: null }
                    return coinPriceOutput
                }
            } catch (err) {
                const coinPriceOutput = { action: 'fetch', message: err.message, data: null }
                return coinPriceOutput
            }
        }
        const io = getIO()

        if (io && !intervelId) {
            io.emit('coin-price', await binanceData())
            intervelId = setInterval(async () => {
                io.emit('coin-price', await binanceData())
            }, 5000)
        }

        return res.status(200).json({
            success: io ? true : false,
            message: io ? 'Connected': 'Unable to connect',
            data: null
        })
    } catch (err) {
        next (err)
    }
}

module.exports = getCoinPrice