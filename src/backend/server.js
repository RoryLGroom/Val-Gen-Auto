import express from 'express'
import morgan from 'morgan'

import api from './api/index.js'

const app = express()

app.use(morgan('dev'))
app.use(express.json()) // handles requests with application/json content-type
app.use(express.urlencoded({ extended: true })) // handles requests with application/x-www-form-urlencoded content-type

const port = process.env.VAL_SERVER_PORT || 8000

app.use('/api', api)

app.use('*splat', (req, res, next) => {
    res.status(404).send({
        error: `Requested resource ${req.originalUrl} does not exist`
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})