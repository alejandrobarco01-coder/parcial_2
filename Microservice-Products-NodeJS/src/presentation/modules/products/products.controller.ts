import { Request, Response } from "express";
import { HandleError } from "../../../domain/erros/handle.error";
import { ProductsService } from "./products.service";
import { CustomError } from '../../../domain/erros/custom.error';

/**
 * Controlador de productos.
 *
 * @remarks
 * Esta clase maneja las peticiones HTTP relacionadas con productos,
 * delegando la lógica de negocio al `ProductsService`.
 */
export class ProductsController {

  /**
   * Servicio de productos.
   */
  private readonly productsService = new ProductsService();

  /**
   * Maneja la petición HTTP para obtener un listado de productos.
   *
   * @remarks
   * El número de productos a generar se obtiene desde los
   * parámetros de la ruta.
   *
   * @param req Objeto de petición de Express
   * @param res Objeto de respuesta de Express
   *
   * @example
   * ```http
   * GET /products/10
   * ```
   */
  getAllProducts = (req: Request, res: Response): void => {
    const limit = Number(req.query.limit ?? 10);
    this.productsService.getAllProducts(limit)
      .then((products) => res.status(200).json(products))
      .catch((error) => HandleError.error(CustomError.badRequest(error instanceof Error ? error.message : 'Solicitud inválida'), res));
  };

  getProductById = (req: Request, res: Response): void => {
    this.productsService.getProductById(Number(req.params.id))
      .then((product) => product ? res.json(product) : HandleError.error(CustomError.notFound('Producto no encontrado'), res))
      .catch((error) => HandleError.error(error, res));
  };

  createProduct = (req: Request, res: Response): void => {
    this.productsService.createProduct(req.body)
      .then((product) => res.status(201).json(product))
      .catch((error) => HandleError.error(CustomError.badRequest(error instanceof Error ? error.message : 'Producto inválido'), res));
  };
}
