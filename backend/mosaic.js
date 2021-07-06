const fs = require('fs')
const {
    CELL,
    CELL_EXTRACT,
    CAROUSEL_THUMBSIZE,
    emitter,
    IMAGE_SIZE,
    imagesDir,
    thumbsDir,
    mosaicsDir
} = require('./config/mosaic')
const sharp = require('sharp')
const { Vector3 } = require('three')
const db = require('./models')

async function createMosaic(imagePath, thumbnails) {
    let buffer
    let mosaic = await sharp({
        create: {
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            channels: 3,
            background: { r: 255, g: 255, b: 255 }
        }
    })
    try {
        const image = await sharp(`${imagesDir}/${imagePath}`).resize(IMAGE_SIZE, IMAGE_SIZE).toBuffer()
        let matriz = []
        for (let top = 0; top < IMAGE_SIZE; top += CELL_EXTRACT) {
            let row = []
            console.time(`fila${top / CELL_EXTRACT}_${imagePath}`)
            for (let left = 0; left < IMAGE_SIZE; left += CELL_EXTRACT) {
                let distances = []
                const extracted = await sharp(image).extract({
                    top,
                    left,
                    width: CELL_EXTRACT,
                    height: CELL_EXTRACT
                }).toBuffer()
                const { dominant } = await sharp(extracted).stats()
                const colorExtracted = new Vector3(dominant.r, dominant.g, dominant.b)
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
                row[left / CELL_EXTRACT] = nearestColorIndex
            }
            console.timeEnd(`fila${top / CELL_EXTRACT}_${imagePath}`)
            matriz[top / CELL_EXTRACT] = row
        }
        console.log('Matriz de imagen guardada', imagePath)
        mosaic.toFile(`${mosaicsDir}/${imagePath}`).then(() => {
            db.Mosaic.create({ path: imagePath, matrix: JSON.stringify(matriz) })
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

async function createThumbnail(path, thumbSize, thumbsDir, process = true, save = false, verbose = false) {
    try {
        const thumbnail = await sharp(`${imagesDir}/${path}`).resize(thumbSize, thumbSize).toBuffer()
        
        if (save) await sharp(thumbnail).toFile(`${thumbsDir}/${path}`)

        if(verbose) console.log('Thumbnail generado')
        if (process) {
            const { dominant } = await sharp(thumbnail).stats()    
            const rgb = new Vector3(dominant.r, dominant.g, dominant.b)
            return { thumbnail, rgb }
        }
        
    } catch (error) {
        throw new Error('Error redimensionando la imagen')
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
    let thumbs = []
    let carouselThumbs = []
    fs.access(dir, fs.constants.F_OK, async (err) => {
        if (err) {
            console.log(err)
            return
        }
        const files = fs.readdirSync(dir)
        files.forEach(path => {
            try {
                //thumbs.push(createThumbnail(path, CELL, './thumbs_mosaicos'))
                carouselThumbs.push(createThumbnail(path, CAROUSEL_THUMBSIZE, './thumbs_carousel', false, true))
            } catch (error) {
                console.log(error)
            }
        })
        Promise.all(thumbs).then((thumbnails) => {
            console.log('Thumbs de mosaicos generados');
            //generateMosaics(thumbnails)
        })
        Promise.all(carouselThumbs).then(() => console.log('Thumbs de carousel guardados'))
    })
}
