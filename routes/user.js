const express = require('express')
const userHandler = require('../handlers/userHandler')
const router = express.Router()

router.get('/getUser/:username', (request, response) => {
    userHandler.getUser(request, response)
})

router.get('/', (request, response) => {
    userHandler.getAll(request, response)
})

router.get('/allWithKonni', (request, response) => {
    userHandler.allWithKonni(request, response)
})

router.post('/', (request, response) => {
    userHandler.postUser(request, response)
})


module.exports = router
