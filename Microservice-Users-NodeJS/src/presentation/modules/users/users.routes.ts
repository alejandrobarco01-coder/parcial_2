import { Router } from "express";
import { UsersController } from "./users.controller";

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UsersController();

    /** @openapi
     * /api/users:
     *   get:
     *     summary: Listar usuarios
     *     tags: [Users]
     *     parameters:
     *       - in: query
     *         name: limit
     *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
     *     responses:
     *       200:
     *         description: Usuarios encontrados
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items: { $ref: '#/components/schemas/User' }
     *       400: { description: Límite inválido }
     */
    router.get("/", controller.getAllUsers);

    /** @openapi
     * /api/users/{id}:
     *   get:
     *     summary: Consultar usuario por id
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: integer, minimum: 1 }
     *     responses:
     *       200: { description: Usuario encontrado }
     *       400: { description: Id inválido }
     *       404: { description: Usuario inexistente }
     */
    router.get("/:id", controller.getUser);

    /** @openapi
     * /api/users:
     *   post:
     *     summary: Registrar usuario
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [name, lastName, age, email, engineering]
     *             properties:
     *               name: { type: string, example: Ana }
     *               lastName: { type: string, example: Gómez }
     *               age: { type: integer, example: 22 }
     *               email: { type: string, format: email, example: ana@example.com }
     *               engineering: { type: string, enum: [Sistemas, Electronica, Biomedica, Industrial, Ambiental] }
     *     responses:
     *       201: { description: Usuario creado }
     *       400: { description: Datos inválidos }
     */
    router.post("/", controller.create);

    return router;
  }
}
