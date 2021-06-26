"use strict"

require('dotenv').config()
const express = require('express')
const app = express()
const process = require('process')
const cors = require('cors')
const createRoutes = require('./routes')

app.use(cors())
app.use(express.json())
app.use(express.static('thumbnails'))

function server() {
    createRoutes(app)
    app.listen(process.env.PORT, () => console.log(`Servidor activo en el puerto ${process.env.PORT}`))
}

server()