const fs = require('fs')
const { CELL, CELL_EXTRACT, emitter, IMAGE_SIZE, imagesDir, thumbsDir } = require('./config/mosaic')
const sharp = require('sharp')
const { Vector3 } = require('three')
const db = require('./models')

async function createMosaic(imagePath, thumbnails) {
    try {
        const image = await sharp(`${imagesDir}/${imagePath}`).resize(IMAGE_SIZE, IMAGE_SIZE).toBuffer()
        let matriz = []
        for (let top = 0; top < IMAGE_SIZE; top += CELL_EXTRACT) {
            let row = []
            for (let left = 0; left < IMAGE_SIZE; left += CELL_EXTRACT) {
                let distances = []
                const extracted = await sharp(image).extract({
                    top,
                    left,
                    width: CELL_EXTRACT,
                    height: CELL_EXTRACT
                }).toBuffer()
                const { channels } = await sharp(extracted).stats()
                const colorExtracted = new Vector3(channels[0].dominant, channels[1].dominant, channels[2].dominant)
                thumbnails.forEach((thumb) => {
                    distances.push(colorExtracted.distanceTo(thumb.rgb))
                })
                const nearestColorIndex = distances.findIndex((distance, i, distances) => distance === Math.min(...distances))
                row[left / CELL_EXTRACT] = nearestColorIndex
            }
            matriz[top / CELL_EXTRACT] = row
            console.log('fila lista', imagePath)
        }
        console.log('Matriz de imagen guardada', imagePath)
        db.Mosaic.create({ path: imagePath, matrix: JSON.stringify(matriz) })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

async function processImage(path) {
    try {
        const thumbnail = await sharp(`${imagesDir}/${path}`).resize(CELL, CELL).toBuffer()
        await sharp(thumbnail).toFile(`${thumbsDir}/${path}`)
        const { channels } = await sharp(thumbnail).stats()

        const rgb = new Vector3(channels[0].dominant, channels[1].dominant, channels[2].dominant)
        console.log('Thumbnail generado')
        return { thumbnail, rgb }
    } catch (error) {
        throw new Error('Error redimensianando la imagen')
    }
}

function generateMosaics(thumbnails) {
    fs.access(imagesDir, fs.constants.F_OK, async function (err) {
        if (err) {
            console.log(err)
            return
        }
        const files = fs.readdirSync(imagesDir)

        db.Mosaic.truncate()
        let mosaicPromises = []
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

module.exports = function generateThumbnails(dir) {
    let images = []
    fs.access(dir, fs.constants.F_OK, async (err) => {
        if (err) {
            console.log(err)
            return
        }
        const files = fs.readdirSync(dir)
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
