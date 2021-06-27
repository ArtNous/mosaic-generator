const fs = require('fs')
const { CELL, CELL_EXTRACT, emitter, imageSize, imagesDir, thumbsDir } = require('./config/mosaic')
const sharp = require('sharp')
const { Vector3 } = require('three')
const db = require('./models')

async function createMosaic(imagePath, thumbnails) {
    let buffer
    let mosaic = await sharp({
        create: {
            width: imageSize,
            height: imageSize,
            channels: 3,
            background: { r: 255, g: 0, b: 0 }
        }
    })
    try {
        const image = await sharp(`${imagesDir}/${imagePath}`).resize(imageSize, imageSize).toBuffer()
        let matriz = []
        for (let top = 0; top < imageSize; top += CELL) {
            let row = []
            for (let left = 0; left < imageSize; left += CELL) {
                let distances = []
                const extracted = await sharp(image).extract({
                    top,
                    left,
                    width: CELL_EXTRACT,
                    height: CELL_EXTRACT
                }).toBuffer()
                const { channels } = await sharp(extracted).stats()
                const colorExtracted = new Vector3(channels[0].mean, channels[1].mean, channels[2].mean)
                thumbnails.forEach((thumb) => {
                    distances.push(colorExtracted.distanceTo(thumb.rgb))
                })
                const nearestColorIndex = distances.findIndex((distance, i, distances) => distance === Math.min(...distances))
                const nearestThumb = thumbnails[nearestColorIndex]
                buffer = await mosaic
                    .composite([{ input: nearestThumb.thumbnail, top, left }])
                    .jpeg()
                    .toBuffer()
                mosaic = sharp(buffer)
                row[left / CELL] = Math.floor(Math.random() * 43)
            }
            matriz[top / CELL] = row
        }
        // mosaic.toFile(path)
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

        const rgb = new Vector3(channels[0].mean, channels[1].mean, channels[2].mean)
        console.log('Thumbnail generado')
        return { thumbnail, rgb }
    } catch (error) {
        throw new Error('Error aumentando la imagen')
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
