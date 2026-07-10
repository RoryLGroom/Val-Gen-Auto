import express from 'express'
import morgan from 'morgan'

import api from './api/index.js'

const app = express()

app.use(morgan('dev'))
app.use(express.json()) // handles requests with application/json content-type
app.use(express.urlencoded({ extended: true })) // handles requests with application/x-www-form-urlencoded content-type

const port = process.env.VAL_SERVER_PORT || 8000

app.use('/api', api)

app.use((err, req, res, next) => {
    if (err instanceof PrismaClientValidationError) {
        res.status(400).send({ error: err.message })
    } else if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
        // convert unique constraint failures, such as duplicate emails, to 400s
        res.status(400).send({ error: "A unique field already exists" })
    } else if (err instanceof PrismaClientKnownRequestError && err.code === "P2003") {
        /*
         * "P2003" means an operation failed because of an invalid foreign key:
         * https://www.prisma.io/docs/orm/reference/error-reference#p2003.
         * In our app, this situation should only arise during the creation of
         * new database records, when an invalid foreign key is specified in
         * the request body.  We'll respond with a 400 error.
         */
        res.status(400).send({ error: err.message })
    } else if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
        /*
         * "P2025" means an operation failed because a specified record was
         * not found: https://www.prisma.io/docs/orm/reference/error-reference#p2025.
         * In our app, we'll always want to send a 404 in this case.
         */
        next()
    } else if (err.type === 'entity.parse.failed') {
        return res.status(400).send({ error: "Invalid JSON in request body" })
    } else {
        console.error(err)
        res.status(500).send({ error: "Internal server error" })
    }
})

app.use('*splat', (req, res, next) => {
    res.status(404).send({
        error: `Requested resource ${req.originalUrl} does not exist`
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})