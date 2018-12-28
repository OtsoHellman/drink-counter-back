const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const server = require('http').Server(app)
let io = require('socket.io')(server)

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
}

const connection = require('./connection')
connection.connect()

const user = require('./routes/user')
const drink = require('./routes/drink')
const userHandler = require('./handlers/userHandler')

app.use(cors())
app.use(bodyParser.json())

app.use('/api/user', user)
app.use('/api/drink', drink)

userHandler.initialize(io)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

io.on('connection', (socket) => {
    console.log('user connected')
    userHandler.emitSocketAllWithKonni(socket)

    let allWithKonni = setInterval(
        () => {
            userHandler.emitSocketAllWithKonni(socket)
        },
        1000
    )
    socket.on('disconnect', () => {
        clearInterval(allWithKonni)
        console.log('user disconnected')
    })
})

// Handle 404
app.use(function (req, res) {
    res.status(404).json({
        error: 'Page not Found',
    })
})

// Handle 500
app.use(function (error, req, res, next) {
    console.log(error)
    res.send('500: Internal Server Error', 500)
})

