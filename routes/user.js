const express = require('express')
const user = require('../services/user')
const router = express.Router()
const allWithKonni = require('../ws/allWithKonni')

router.get('/getUser/:username', (request, response) => {
    user.getUser()
        .then(response.json)
})

router.get('/', (request, response) => {
    user.getAll()
        .then(response.json)
})

router.get('/allWithKonni', (request, response) => {
    user.allWithKonni()
        .then(response.send)
})

router.post('/', (request, response) => {
    const user = request.body
    if (!user.username) {
        const err = new Error('username missing')
        err.status = 400
        throw err
    }
    if (!user.mass || user.mass > 9001) { // IT'S OVER 9000
        const err = new Error('mass missing or invalid')
        err.status = 400
        throw err
    }
    if (!user.gender) {
        const err = new Error('gender missing')
        err.status = 400
        throw err
    }
    user.createUser(user)
        .then(() => {
            allWithKonni.emitAllWithKonni()
            response.json(user)
        })
        .catch((err) => {
            if (err.code === 11000) { // non-unique name
                const newErr = new Error('name must be unique')
                newErr.status = 400
                throw newErr
            } else {
                throw err
            }
        })
})


module.exports = router
