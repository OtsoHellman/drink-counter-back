const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
}

const connection = require('./connection')
connection.connect()

const user = require('./routes/user')
const drink = require('./routes/drink')

app.use(cors())
app.use(bodyParser.json())

app.use('/api/user', user)
app.use('/api/drink', drink)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Handle 404
app.use(function(req, res) {
    res.status(404).json({
        error: 'Page not Found',
    });
})

// Handle 500
app.use(function(error, req, res, next) {
    console.log(error)
    res.send('500: Internal Server Error', 500);
})

