const EventEmitter = require('events')

const emitter = new EventEmitter()
emitter.addListener('mosaic-generated', () => {
    // Enviar email
    console.log('Mosaicos guardados en base de datos.')
})

module.exports = {
    CELL_EXTRACT: 50,
    CELL: 100,
    imageSize: 500,
    imagesDir: './images',
    thumbsDir: './thumbnails',
    emitter
}