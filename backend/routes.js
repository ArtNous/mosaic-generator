const generateThumbnails = require('./mosaic')
const db = require('./models')

module.exports = app => {
    app.post('/', (req, res) => {
        const email = req.query.email
        generateThumbnails('./images')
        res.json({ msg: 'Tarea en proceso' })
    })

    app.post('/grids', async (req, res) => {
        try {
            const matrixs = await db.Mosaic.findAll({
                attributes: ['path', 'matrix']
            })
            res.json({ thumbs: matrixs.map(matrix => ({ path: `${process.env.HOST}:${process.env.PORT}/${matrix.path}`, matrix: matrix.matrix })) })
        } catch (error) {
            console.log(error)
        }
    })

    app.get('/test', (req, res) => {
        res.json({
            msg: 'Funcionando perfecto'
        })
    })
}