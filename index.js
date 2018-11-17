const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
    app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
}

const connection = require('./connection')
connection.connect()

const example = require('./routes/example')

app.use(cors())
app.use(bodyParser.json())

app.use('/api/example', example)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use((req, res, next, err) => {
    console.log(err)
})
