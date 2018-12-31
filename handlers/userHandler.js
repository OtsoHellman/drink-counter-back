const User = require('../models/user')
const Drink = require('../models/drink')

const konniCalculator = require('../utils/konniCalculator')

let io;

const initialize = (wsServer) => {
    io = wsServer
}

const allWithKonni = () => {
    return Promise.all([
        Drink.find({}).exec(),
        User.find({}).exec()
    ]).then(([drinks, users]) => {
        let data = []
        let timestamps = []
        for (let userObject of users) {
            const username = userObject.username
            const userDrinks = drinks.filter(drink => drink.username === username)
            data.push({
                x: username,
                y: konniCalculator.getKonni(userObject, userDrinks)
            })
            timestamps.push({
                username,
                graphData: konniCalculator.getTimestamps(userObject, userDrinks)
            })
        }
        const firstDrink = Math.min(...timestamps.filter(user => user.graphData.length > 0).map(user => user.graphData[0].x))
        timestamps.map(user => (
            user.graphData.unshift({ x: firstDrink, y: 0 })
        ))

        return {
            data,
            timestamps
        }
    })
}

const emitAllWithKonni = () => {
    allWithKonni()
        .then((konniObject) => {
            io.emit("allWithKonni", konniObject)
        })
}

const emitSocketAllWithKonni = (socket) => {
    allWithKonni()
        .then((konniObject) => {
            socket.emit("allWithKonni", konniObject)
        })
}

const getAllWithKonni = (request, response) => {
    return allWithKonni()
        .then((konniObject) => {
            return response.json(konniObject)
        })
        .catch((err) => {
            return response.status(500).json({
                error: err.message,
            })
        })
}

const getUser = (request, response) => {
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

        return response.json({
            ...userObject,
            konni: konniCalculator.getKonni(userObject, drinks)
        })
    }).catch((err) => {
        return response.status(500).json({
            error: err.message,
        })
    })
}

const postUser = (request, response) => {
    const user = request.body
    if (!user.username) {
        return response.status(400).json({
            error: 'username missing'
        })
    }
    if (!user.mass || user.mass > 9001 || user.mass < 30) {
        return response.status(400).json({
            error: 'mass missing or invalid'
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
        emitAllWithKonni()
        return response.json(user)
    })
}

const getAll = (request, response) => {
    User.find({}, (err, users) => {
        if (err) {
            return response.status(500).json({
                error: err.message,
            })
        }
        return response.json(users)
    })
}

exports.initialize = initialize
exports.getAllWithKonni = getAllWithKonni
exports.emitAllWithKonni = emitAllWithKonni
exports.emitSocketAllWithKonni = emitSocketAllWithKonni
exports.getUser = getUser
exports.getAll = getAll
exports.postUser = postUser