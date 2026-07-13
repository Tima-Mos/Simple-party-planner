/**
 * @openapi
 * /api/rooms:
 *   post:
 *     tags: [Rooms]
 *     summary: Создать комнату
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NicknameBody'
 *     responses:
 *       201:
 *         description: Комната создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomId:
 *                   type: string
 *                   format: uuid
 *                 shareUrl:
 *                   type: string
 *                   example: /room/550e8400-e29b-41d4-a716-446655440000
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/rooms/{roomId}/join:
 *   post:
 *     tags: [Rooms]
 *     summary: Присоединиться к комнате
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NicknameBody'
 *     responses:
 *       200:
 *         description: Успешное присоединение
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 nickname:
 *                   type: string
 *       404:
 *         description: Room not found
 *
 * /api/rooms/{roomId}/calendar:
 *   get:
 *     tags: [Rooms]
 *     summary: Получить календарь комнаты
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Данные календаря
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dates:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                   example:
 *                     "2026-07-13": ["Арагорн", "Гендальф"]
 *                 totalUsers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Арагорн", "Гендальф", "Леголас"]
 *       404:
 *         description: Room not found
 *
 * /api/rooms/{roomId}/availability:
 *   post:
 *     tags: [Availability]
 *     summary: Toggle отметки даты (toggle-логика)
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvailabilityBody'
 *     responses:
 *       200:
 *         description: Обновленный список пользователей на дату
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: "2026-07-20"
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Арагорн", "Гендальф", "Леголас"]
 *       400:
 *         description: Validation error or date out of range
 *       404:
 *         description: Room not found
 *   delete:
 *     tags: [Availability]
 *     summary: Удалить все отметки пользователя в комнате
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NicknameBody'
 *     responses:
 *       200:
 *         description: Успешное удаление
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Room not found
 *
 * /api/rooms/{roomId}/users:
 *   get:
 *     tags: [Rooms]
 *     summary: Список пользователей в комнате
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Арагорн", "Гендальф", "Леголас"]
 *       404:
 *         description: Room not found
 */
export {}
