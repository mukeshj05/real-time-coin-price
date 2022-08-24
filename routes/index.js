const { Router } = require("express")
const controller = require('../controllers')

const router = Router()

router.get('/coin-price', controller.getCoinPrice)

module.exports = router