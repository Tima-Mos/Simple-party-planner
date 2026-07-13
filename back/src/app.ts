import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import roomsRouter from './routes/rooms'
import { errorHandler } from './middleware/errorHandler'
import { swaggerSpec } from './docs/swagger'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api', roomsRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

export default app
