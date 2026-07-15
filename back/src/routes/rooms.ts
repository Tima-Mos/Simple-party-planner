import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma'
import { createRoomSchema, joinRoomSchema, availabilitySchema } from '../schemas/room'
import { AppError } from '../middleware/errorHandler'
import { logger } from '../logger'

const router = Router()

function getRoomId(req: Request): string {
  const roomId = req.params.roomId
  if (Array.isArray(roomId)) throw new AppError(400, 'Invalid roomId')
  return roomId
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function isValidDateRange(dateStr: string): boolean {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return false
  const now = new Date()
  const threeMonthsAgo = new Date(now)
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  threeMonthsAgo.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return date >= threeMonthsAgo
}

// POST /api/rooms — create a room
router.post('/rooms', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = createRoomSchema.parse({ body: req.body })
    const room = await prisma.room.create({
      data: { name: body.name },
    })
    logger.info('Room created', { roomId: room.id, name: room.name })
    res.status(201).json({
      roomId: room.id,
      name: room.name,
      shareUrl: `/room/${room.id}`,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/rooms/:roomId/join
router.post('/rooms/:roomId/join', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = joinRoomSchema.parse({ body: req.body })
    const roomId = getRoomId(req)
    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) throw new AppError(404, 'Room not found')

    if (!body.rejoin) {
      const existingUser = await prisma.availability.findFirst({
        where: { roomId, nickname: body.nickname },
      })
      if (existingUser) {
        throw new AppError(409, 'Этот никнейм уже занят в этой комнате')
      }
    }

    res.json({ success: true, nickname: body.nickname })
  } catch (err) {
    next(err)
  }
})

// GET /api/rooms/:roomId/calendar
router.get('/rooms/:roomId/calendar', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomId = getRoomId(req)
    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) throw new AppError(404, 'Room not found')

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await prisma.availability.deleteMany({
      where: {
        roomId,
        date: { lt: today },
      },
    })

    const availabilities = await prisma.availability.findMany({
      where: { roomId },
      select: { date: true, nickname: true },
    })

    const dates: Record<string, string[]> = {}
    const totalUsersSet = new Set<string>()

    for (const a of availabilities) {
      const dateKey = formatDate(a.date)
      if (!dates[dateKey]) dates[dateKey] = []
      dates[dateKey].push(a.nickname)
      totalUsersSet.add(a.nickname)
    }

    res.json({
      name: room.name,
      dates,
      totalUsers: Array.from(totalUsersSet),
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/rooms/:roomId/availability — toggle
router.post('/rooms/:roomId/availability', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = availabilitySchema.parse({ body: req.body })
    const roomId = getRoomId(req)

    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) throw new AppError(404, 'Room not found')

    if (!isValidDateRange(body.date)) {
      throw new AppError(400, 'Date must be within 3 months in the past')
    }

    const dateObj = new Date(body.date)

    const existing = await prisma.availability.findUnique({
      where: {
        roomId_date_nickname: {
          roomId,
          date: dateObj,
          nickname: body.nickname,
        },
      },
    })

    if (existing) {
      await prisma.availability.delete({ where: { id: existing.id } })
    } else {
      await prisma.availability.create({
        data: { roomId, date: dateObj, nickname: body.nickname },
      })
    }

    const allForDate = await prisma.availability.findMany({
      where: { roomId, date: dateObj },
      select: { nickname: true },
    })

    res.json({
      date: body.date,
      users: allForDate.map((a) => a.nickname),
    })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/rooms/:roomId/availability — remove all availabilities for a user in a room
router.delete('/rooms/:roomId/availability', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = joinRoomSchema.parse({ body: req.body })
    const roomId = getRoomId(req)

    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) throw new AppError(404, 'Room not found')

    await prisma.availability.deleteMany({
      where: { roomId, nickname: body.nickname },
    })

    logger.info('User removed from room', { roomId, nickname: body.nickname })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

// GET /api/rooms/:roomId/users
router.get('/rooms/:roomId/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomId = getRoomId(req)

    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) throw new AppError(404, 'Room not found')

    const result = await prisma.availability.findMany({
      where: { roomId },
      select: { nickname: true },
      distinct: ['nickname'],
    })

    res.json({
      users: result.map((r) => r.nickname),
    })
  } catch (err) {
    next(err)
  }
})

export default router
