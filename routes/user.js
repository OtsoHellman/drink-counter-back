const express = require('express')

const User = require('../models/user')
const Drink = require('../models/drink')
const getKonni = require('../utils/konniCalculator').getKonni

const router = express.Router()

router.get('/:username', (request, response) => {
    const username = request.params.username

    Promise.all([
        Drink.find({
            username,
        }).exec(),
        User.findOne({
            username,
        }).exec()
    ]).then(([drinks, user]) => {
        if (!user) {
            return response.status(404).json({
                error: 'User not found',
            })
        }
        const userObject = user.toObject()
        const drinkArr = drinks.map(drink => drink.timestamp)

        response.json({
            ...userObject,
            konni: getKonni(userObject, drinkArr)
        })
    }).catch((err) => {
        return response.status(500).json({
            error: err.message,
        })
    })
})

router.get('/', (request, response) => {
    User.find({}, (err, users) => {
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
