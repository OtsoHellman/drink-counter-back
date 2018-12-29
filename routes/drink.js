const express = require('express')
const drinkHandler = require('../services/drink')
const userHandler = require('../services/user')

const router = express.Router()

router.post('/', (request, response) => {
    const { username, drinkSize } = request.body
    if (!username) {
        const err = new Error('username missing')
        err.status = 400
        throw err
    }

    if (!drinkSize || typeof(drinkSize) !== 'number' || drinkSize <= 0) {
        const err = new Error('invalid or missing drinkSize')
        err.status = 400
        throw err
    }

    drinkHandler.addDrink(username, drinkSize)
        .then((drink) => {
            userHandler.emitAllWithKonni()
            response.json(drink)
        })
})

module.exports = router
