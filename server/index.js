import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './routes.js'
import 'dotenv/config'


const app = express()
const PORT = 8000
const MONGO_URI = "your mongo uri"

app.use(cors())


mongoose.connect(MONGO_URI).then(() => app
.listen(PORT, () => {
    console.log(`server listening at http://localhost:${PORT}`)
}))

app.use(router)
