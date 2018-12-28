const express = require('express')
const drinkHandler = require('../handlers/drinkHandler')

const router = express.Router()

router.post('/', (request, response) => {
    return drinkHandler.postDrink(request, response)
})

module.exports = router
