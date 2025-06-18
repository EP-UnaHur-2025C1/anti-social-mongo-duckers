const express = require('express')
const app = express()
const conectarDB = require('./config/db')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDocument = YAML.load('./docs/swagger.yaml')

require('dotenv').config()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', require('./routes/userRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/images', require('./routes/postImagesRoutes'));
app.use('/comments', require('./routes/commentRoutes'));
app.use('/tags', require('./routes/tagRoutes'));

// Conexión a MongoDB
conectarDB()

app.listen(PORT, ()=>{
    console.log(`Aplicación corriendo en el puerto: ${PORT}`)
    console.log('Documentación en http://localhost:3000/api-docs')
})