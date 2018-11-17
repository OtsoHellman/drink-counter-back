const express = require('express')

const Example = require('../models/example')

const router = express.Router()

router.get('/', (request, response) => {
    res.send('Example')
})

module.exports = router
