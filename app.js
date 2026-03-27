import express from 'express'
import authRoutes from './routes/authRoutes.js'
import postsRoutes from './routes/postsRoutes.js'
import connectDB from './config/db.js'
import verifyJWT from './middlewares/verifyJWT.js'

const PORT = process.env.PORT

connectDB()

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/api/posts', verifyJWT, postsRoutes)

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})