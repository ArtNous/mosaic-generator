const generateThumbnails = require('./mosaic')
const db = require('./models')
const fs = require('fs')

module.exports = app => {
    app.post('/', (req, res) => {
        const email = req.query.email
        try {
            fs.accessSync('./tmp')
            res.json({ msg: 'Hay un proceso corriendo actualmente. Por favor espere que termine.' })
        } catch (error) {
            fs.writeFileSync('./tmp', 'Generando')
            generateThumbnails('./images')
            res.json({ msg: 'Tarea en proceso' })            
        }
    })

    app.post('/grids', async (req, res) => {
        try {
            const matrixs = await db.Mosaic.findAll({
                attributes: ['path', 'matrix']
            })
            res.json({ thumbs: matrixs.map(matrix => ({ path: `${process.env.SERVER}/${matrix.path}`, matrix: JSON.parse(matrix.matrix) })) })
        } catch (error) {
            console.log(error)
        }
    })

    app.get('/paths', async (req, res) => {
        const carouselThumbsDir = './thumbs_carousel'
        const mosaicsDir = './thumbs_mosaicos'
        try {
            fs.accessSync(carouselThumbsDir, fs.constants.F_OK)
            fs.accessSync(mosaicsDir, fs.constants.F_OK)
            const carousels = fs.readdirSync(carouselThumbsDir)
            const mosaics = fs.readdirSync(mosaicsDir)
            carousels.splice(0,4)
            mosaics.splice(0,4)
            const resJson = {
                mosaics: mosaics.map(path => `http://localhost:8080/${path}`),
                carousels: carousels.map(path => `http://localhost:8080/${path}`)
            }
            res.json(resJson)
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: `No se encuentra el directorio ${carouselThumbsDir}` })
        }
    })

    app.get('/test', (req, res) => {
        res.json({
            msg: 'Funcionando perfecto'
        })
    })
}