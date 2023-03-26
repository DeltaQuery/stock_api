require('dotenv').config()
const express = require('express')
const cors = require('cors')
//additionals
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const path = require("path")

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/error.controller.js')
const routerApi = require('./routes')

const createApp = () => {
    const app = express()
    // Body parser, reading data from body into req.body
    app.use(express.json({ limit: '10kb' }))

    // 1) GLOBAL MIDDLEWARES
    // Set security HTTP headers
    app.use(helmet())

    // Development logging
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }

    // Limit requests from same API
    const limiter = rateLimit({
        max: 100,
        windowMs: 60 * 60 * 2000,
        message: 'Too many requests from this IP, please try again in an hour!'
    })
    app.use('/api', limiter)

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize())

    // Data sanitization against XSS
    app.use(xss())

    // Prevent parameter pollution
    app.use(
        hpp({
            whitelist: [
                'duration',
                'ratingsQuantity',
                'ratingsAverage',
                'maxGroupSize',
                'difficulty',
                'price'
            ]
        })
    )

    //set view
    app.set("views", path.join(__dirname, "views"))
    app.set("view engine", "ejs")

    app.use(express.static(`${__dirname}/public`))

    const whitelist = ['http://localhost:8080', 'https://myapp.co']
    const options = {
        origin: (origin, callback) => {
            if (whitelist.includes(origin) || !origin) {
                callback(null, true)
            } else {
                callback(new Error('not allowed'))
            }
        }
    }
    app.use(cors(options))

    //require('./utils/auth')

    app.get('/', (req, res) => {
        res.send('Ve a /api/v1/guide para una lista de las compañías cuya información está disponible. Las solicitudes están basadas en scrapping y tomarán algunos segundos (10-12 segs).')
    })

    routerApi(app)

    app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
    })

    app.use(globalErrorHandler)

    return app
}

module.exports = createApp