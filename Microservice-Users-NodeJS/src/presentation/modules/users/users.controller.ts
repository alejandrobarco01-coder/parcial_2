import { Request, Response } from "express";
import { HandleError } from "../../../domain/erros/handle.error";
import { ListUsersUseCase } from '../../../application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '../../../application/use-cases/get-user-by-id.use-case';
import { CreateUserUseCase } from '../../../application/use-cases/create-user.use-case';
import { InMemoryUsersRepository } from '../../../infrastructure/repositories/in-memory-users.repository';
import { CreateUserInput } from '../../../domain/interfaces/user.interface';

/**
 * Controlador de usuarios.
 *
 * @remarks
 * Esta clase maneja las peticiones HTTP relacionadas con usuarios,
 * delegando la lógica de negocio a los casos de uso de Usuarios.
 */
export class UsersController {
  private readonly repository = new InMemoryUsersRepository();
  private readonly listUsers = new ListUsersUseCase(this.repository);
  private readonly getUserById = new GetUserByIdUseCase(this.repository);
  private readonly createUser = new CreateUserUseCase(this.repository);

  /**
   * Maneja la petición HTTP para obtener un listado de usuarios.
   *
   * @remarks
   * El número de usuarios a generar se obtiene desde los
   * parámetros de la ruta.
   *
   * @param req Objeto de petición de Express
   * @param res Objeto de respuesta de Express
   *
   * @example
   * ```http
   * GET /users?limit=10
   * ```
   */
  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawLimit = req.query['limit'];
      const limit = rawLimit === undefined ? 10 : Number(rawLimit);
      const users = await this.listUsers.execute(limit);
      res.status(200).json(users);
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.getUserById.execute(Number(req.params['id']));
      res.status(200).json(user);
    } catch (error) {
      HandleError.error(error, res);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.createUser.execute(req.body as CreateUserInput);
      res.status(201).json(user);
    } catch (error) {
      HandleError.error(error, res);
    }
  };
}
