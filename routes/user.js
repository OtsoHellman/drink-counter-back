const express = require('express')

const User = require('../models/user')

const router = express.Router()

router.get('/:username', (request, response) => {
    const username = request.params.username
    User.findOne({
        username,
    }, (err, user) => {
        if (err) {
            return response.status(500).json({
                error: err.message,
            })
        }
        if (!user) {
            return response.status(404).json({
                error: 'User not found',
            })
        }
        response.json(user)
    })
})

router.get('/', (request, response) => {
    User.find({}, function(err, users) {
        if (err) {
            return response.status(500).json({
                error: err.message,
            })
        }
        response.json(users)
    })
})

router.post('/', (request, response) => {
    const user = request.body
    if (!user.username) {
        return response.status(400).json({
            error: 'username missing'
        })
    }
    if (!user.mass) {
        return response.status(400).json({
            error: 'mass missing'
        })
    }
    if (!user.gender) {
        return response.status(400).json({
            error: 'gender missing'
        })
    }
    new User(user).save((err, user) => {
        if (err) {
            if (err.code === 11000) { // non-unique name
                return response.status(400).json({
                    error: 'name must be unique'
                })
            } else {
                return response.status(500).json({
                    error: err.message,
                })
            }
        }
        response.json(user)
    })
})


module.exports = router
