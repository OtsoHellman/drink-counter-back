const express = require('express')

const User = require('../models/user')
const Drink = require('../models/drink')

const router = express.Router()

router.post('/', (request, response) => {
    const username = request.body.username
    if (!username) {
        return response.status(400).json({
            error: 'username missing'
        })
    }

    User.findOne({
        username
    }).then((user) => {
        if (!user) {
            return response.status(400).json({
                error: 'user not in database'
            })
        }
        
        new Drink({
            username,
            timestamp: Date.now(),
        }).save((err, drink) => {
            if (err) {
                throw err
            }
            response.json(drink)
        })
    }).catch((err) => {
        return response.status(500).json({
            error: err.message,
        })
    })
})

module.exports = router
