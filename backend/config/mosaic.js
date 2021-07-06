const EventEmitter = require('events')
const fs = require('fs')

const emitter = new EventEmitter()
emitter.addListener('mosaic-generated', () => {
    // Enviar email
    console.log('Mosaicos guardados en base de datos.')
    fs.unlink('./tmp', err => console.log('No se pudo eliminar el archivo temporal.', err))
})

module.exports = {
    CAROUSEL_THUMBSIZE: 96,
    CELL_EXTRACT: 10,
    CELL: 30,
    IMAGE_SIZE: 1000,
    imagesDir: './images',
    thumbsDir: './thumbnails',
    mosaicsDir: './mosaics',
    emitter
}