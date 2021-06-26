const EventEmitter = require('events')

const emitter = new EventEmitter()
emitter.addListener('mosaic-generated', () => {
    // Enviar email
    console.log('Mosaicos guardados en base de datos.')
})

module.exports = {
    CELL: 50,
    imageSize: 1000,
    imagesDir: './images',
    thumbsDir: './thumbnails',
    emitter
}