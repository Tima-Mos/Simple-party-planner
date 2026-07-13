import { z } from 'zod'

const NICKNAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ0-9 _-]{2,20}$/

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, 'Nickname must be at least 2 characters')
    .max(20, 'Nickname must be at most 20 characters')
    .regex(NICKNAME_REGEX, 'Nickname can only contain letters, numbers, spaces, _ and -'),
})

export const createRoomSchema = z.object({
  body: nicknameSchema,
})

export const joinRoomSchema = z.object({
  body: nicknameSchema,
})

export const availabilitySchema = z.object({
  body: z.object({
    nickname: nicknameSchema.shape.nickname,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  }),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>
export type JoinRoomInput = z.infer<typeof joinRoomSchema>
export type AvailabilityInput = z.infer<typeof availabilitySchema>
