const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require('helmet');

const mongoDB = require("./src/databases/mongodb/database");
const OffersCron = require("./src/utils/Offers_Cron.js")
const {
    exceptionHandler
} = require('./src/ErrorHandler/globalHandler')
const response = require('./src/utils/response.js')
const rateLimiter = require('./src/utils/rateLimit.js');

require('dotenv').config();


const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors())
    .use(helmet())
    .use(rateLimiter)
    .use(bodyParser.json())
    .use(bodyParser.json({ limit: '10mb' }))
    .use(bodyParser.urlencoded({ extended: true }))



app.use("/api/", require("./src/routes"));
app.all('*', (req, res, next) => {
    response(res, 404, 'Page not found.')
})

//error-handling middleware 
app.use(exceptionHandler)

process.on('uncaughtException', (error) => {
    console.error(error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error(error);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})