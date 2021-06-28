"use strict"

const express = require('express')
const EventEmitter = require('events')
const app = express()
const process = require('process')
const fs = require('fs')
const sharp = require('sharp')
const three = require('three')
const db = require('./models')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('thumbnails'))

let images = []
const imagesDir = './images'
const thumbsDir = './thumbnails'
const emitter = new EventEmitter()

emitter.addListener('mosaic-generated', () => {
    // Enviar email
    console.log('Tumbols generados')
})

const TAM_MINIATURA = 10
const TAM_MINIATURA = 30

async function processImage(path) {

    try {
        const thumbnail = await sharp(`${imagesDir}/${path}`).resize(TAM_MINIATURA, TAM_MINIATURA).toBuffer()
        await sharp(thumbnail).toFile(`${thumbsDir}/${path}`)
        const { channels } = await sharp(thumbnail).stats()

        const rgb = new three.Vector3(channels[0].dominant, channels[1].dominant, channels[2].dominant)
        console.log('Thumbnail generado')
        return { thumbnail, rgb }
    } catch (error) {
        throw new Error('Error redimensionando la imagen')
    }
}

function generateThumbnails() {
    fs.access(imagesDir, fs.constants.F_OK, async (err) => {
        if (err) {
            console.log(err)
            return
        }
        const files = fs.readdirSync(imagesDir)
        files.forEach(path => {
            try {
                images.push(processImage(path))
            } catch (error) {
                console.log(error)
            }
        })
        Promise.all(images).then((thumbnails) => {
            generateMosaics(thumbnails)
        })
    })
}

async function createMosaic(imagePath, thumbnails) {
    const imageSize = 1000
    // let buffer
    /* let mosaic = await sharp({
        create: {
            width: imageSize,
            height: imageSize,
            channels: 3,
            background: { r: 255, g: 0, b: 0 }
        }
    }) */
    try {
        const image = await sharp(`${imagesDir}/${imagePath}`).resize(imageSize, imageSize).toBuffer()
        let matriz = []
        for (let top = 0; top < imageSize; top += CELL) {
            let row = []
            for (let left = 0; left < imageSize; left += CELL) {
                let distances = []
                /* const extracted = await sharp(image).extract({
                    top,
                    left,
                    width: CELL,
                    height: CELL
                }).toBuffer()
                const { channels } = await sharp(extracted).stats()
                const colorExtracted = new three.Vector3(channels[0].mean, channels[1].mean, channels[2].mean)
                thumbnails.forEach(function (thumb) {
                    distances.push(colorExtracted.distanceTo(thumb.rgb))
                })
                const nearestColorIndex = distances.findIndex((distance, i, distances) => distance === Math.min(...distances)) */
                // const nearestThumb = thumbnails[nearestColorIndex]
                /* buffer = await mosaic
                    .composite([{ input: nearestThumb.thumbnail, top, left }])
                    .jpeg()
                    .toBuffer()
                mosaic = sharp(buffer) */
                row[left / CELL] = Math.floor(Math.random() * 43)
            }
            matriz[top / CELL] = row
            console.log(imagePath, matriz)
        }
        // mosaic.toFile(path)
        db.Mosaic.create({ path: imagePath, matrix: matriz })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

function generateMosaics(thumbnails) {
    let mosaicPromises = []
    fs.access(imagesDir, fs.constants.F_OK, async function (err) {
        if (err) {
            console.log(err)
            return
        }
        const files = fs.readdirSync(imagesDir)

        db.Mosaic.truncate()
        for (const imagePath of files) {
            try {
                fs.accessSync(`${thumbnails}/${imagePath}`, fs.constants.F_OK)
            } catch (error) {
                mosaicPromises.push(createMosaic(imagePath, thumbnails))
            }
        }
        Promise.all(mosaicPromises).then(() => {
            emitter.emit('mosaic-generated')
        })
    })
}

function server() {
    app.get('/', (req, res) => {
        const email = req.query.email
        generateThumbnails()
        res.json({ msg: 'Tarea en proceso' })
    })

    app.post('/test', async (req, res) => {
        const dir = './mosaics'
        try {
            const matrixs = await db.Mosaic.findAll({
                attributes: ['path', 'matrix']
            })
            res.json({ thumbs: matrixs.map(matrix => ({path: `http://localhost:8080/${matrix.path}`, matrix: matrix.matrix})) })
            /* fs.accessSync(dir)
            const thumbs = fs.readdirSync(dir) */
        } catch (error) {
            console.log(error)
            console.log(`No existe el directorio ${dir}`)
            res.status(500).json({
                msg: `No existe el directorio ${dir}`
            })
        }
    })

    app.listen(process.env.PORT, () => console.log(`Servidor activo en el puerto ${process.env.PORT}`))
}

server()