import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import postsRoutes from './routes/postsRoutes.ts'
import connectDB from './config/db.ts'
import verifyJWT from './middlewares/verifyJWT.ts'

const PORT = process.env.PORT

connectDB()

const app = express()
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/api/posts', verifyJWT, postsRoutes)

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})