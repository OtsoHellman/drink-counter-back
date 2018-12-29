const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const server = require('http').Server(app)

const ws = require('socket.io')(server)

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
}

const connection = require('./connection')

connection.connect()

const user = require('./routes/user')
const drink = require('./routes/drink')
const allWithKonni = require('./ws/allWithKonni')

app.use(cors())
app.use(bodyParser.json())

app.use('/api/user', user)
app.use('/api/drink', drink)

allWithKonni.initialize(ws)

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Page not Found',
    })
})

// Handle 500
app.use((error, req, res, next) => {
    console.log(error)
    if (error.status) {
        res.status(error.status).send(error.message)
    } else {
        res.status(500).send('500: Internal Server Error')
    }
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
