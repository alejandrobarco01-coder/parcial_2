/**
 * @openapi
 * components:
 *   schemas:
 *     Sale:
 *       type: object
 *       description: Representa una venta del sistema
 *       required:
 *         - id
 *         - customer
 *         - item
 *         - quantity
 *         - total
 *         - status
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         customer:
 *           type: string
 *           example: Ana Gómez
 *         item:
 *           type: string
 *           example: Leche entera
 *         quantity:
 *           type: number
 *           example: 2
 *         total:
 *           type: number
 *           example: 9000
 *         status:
 *           type: string
 *           enum:
 *             - Pendiente
 *             - Pagada
 *             - Entregada
 *           example: Pagada
 */
export {};