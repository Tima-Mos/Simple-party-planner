import app from './app'
import { config } from './config'
import { prisma } from './prisma'
import { logger } from './logger'

async function main() {
  await prisma.$connect()
  logger.info('Connected to database')

  app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`)
  })
}

main().catch((err) => {
  logger.error('Failed to start server', { error: err.message })
  process.exit(1)
})
