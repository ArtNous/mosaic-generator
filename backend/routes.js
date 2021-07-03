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

    app.get('/paths',async (req, res) => {
        const dir = './thumbnails'
        try {
            fs.accessSync(dir, fs.constants.F_OK)
            const files = fs.readdirSync(dir)
            files.splice(0,4)
            res.json({ paths: files.map(name => ({src: `http://localhost:8080/${name}`})) })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: `No se encuentra el directorio ${dir}`
            })
        }
    })

    app.get('/test', (req, res) => {
        res.json({
            msg: 'Funcionando perfecto'
        })
    })
}