const express = require('express')
const drinkTypeHandler = require('../handlers/drinkTypeHandler')
const router = express.Router()

router.post('/', (request, response) => {
    const { drinkName, drinkSize } = request.body

    if (!drinkName) {
        return response.status(400).json({
            error: 'drink name missing'
        })
    }

    if (!drinkSize || typeof (drinkSize) !== 'number' || drinkSize <= 0 || drinkSize >= 50) {
        return response.status(400).json({
            error: 'invalid or missing drinkSize'
        })
    }

    return drinkTypeHandler.createDrinkType(drinkName, drinkSize)
        .then((drink) => {
            response.json(drink)
        })
        .catch((err) => {
            if (err.code === 11000) { // non-unique name
                return response.status(400).json({
                    error: 'Drink already exists!'
                })
            } else {

                return response.status(500).json({
                    error: err.message,
                })
            }
        })
})

router.get('/', (request, response) => {
    drinkTypeHandler.getAll()
        .then((drinkTypes) => {
            return response.json(drinkTypes)
        })
        .catch((err) => {
            return response.status(500).json({
                error: err.message,
            })
        })
})



module.exports = router