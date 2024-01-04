require('dotenv').config()

const connection = {
    host: process.env.HOST,
    port: process.env.PORT
}

module.exports = {
    connection,
}